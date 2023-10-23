const dotenv = require('dotenv');
dotenv.config();
const {
  Client,
  Events,
  GatewayIntentBits,
  Partials, Collection,
  WebhookClient: W,
  EmbedBuilder: E,
  codeBlock } = require('discord.js'),
  chalkAnimation = require('chalk-animation'),
  fs = require("node:fs"),
  path = require('node:path'),
  client = new Client({
    intents: [GatewayIntentBits.AutoModerationConfiguration, GatewayIntentBits.AutoModerationExecution, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
    partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember],
    shards: "auto"
  })
token = process.env.token,
  prefix = process.env.prefix;

var PrettyError = require('pretty-error');
var pe = new PrettyError();
//pe.start();

chalkAnimation.rainbow("Starting...")

client.once(Events.ClientReady, c => {
  chalkAnimation.neon(`\nReady! Logged in as ${c.user.tag}`);
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.slash = new Collection();
// webhooks 

const errorLogs = new W({ url: `${process.env.errorHook}` })

// prefix command handler 

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

client.on(Events.MessageCreate, message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(' ');
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply('I can\'t execute that command inside DMs!');
  }

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  const { cooldowns } = client;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }

  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(client, message, args);
  } catch (error) {

    if (error) if (error.length > 950) error = error.slice(0, 950) + '... view console for details';
    if (error.stack) if (error.stack.length > 950) error.stack = error.stack.slice(0, 950) + '... view console for details';
    if (!error.stack) return
    const errorEmbed = new E()
      .setTitle(`⛔ Prefix command error`)
      .addFields([{ name: "Error", value: error ? codeBlock(error) : "No error" },
      { name: "Stack error", value: error.stack ? codeBlock(error.stack) : "No stack error" }]);
    console.log(pe.render(error))
    try {
      errorLogs.send({ embeds: [errorEmbed] })
    } catch {
      console.log('Error sending prefix command to webhook')
      console.log(pe.render(error))

    }
  }

});

const foldersPath = path.join(__dirname, 'slash');
const slashCommandFolders = fs.readdirSync(foldersPath);

// slash command handler

for (const slashFolder of slashCommandFolders) {
  const commandsPath = path.join(foldersPath, slashFolder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'run' in command) {
      client.slash.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slash.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.run(client, interaction);
  } catch (error) {

    if (error) if (error.length > 950) error = error.slice(0, 950) + '... view console for details';
    if (error.stack) if (error.stack.length > 950) error.stack = error.stack.slice(0, 950) + '... view console for details';
    if (!error.stack) return
    const errorEmbed = new E()
      .setTitle(`⛔ Prefix command error`)
      .addFields([{ name: "Error", value: error ? codeBlock(error) : "No error" },
      { name: "Stack error", value: error.stack ? codeBlock(error.stack) : "No stack error" }]);
    console.log(pe.render(error))
    try {
      errorLogs.send({ embeds: [errorEmbed] })
    } catch {
      console.log('Error sending slash command log to webhook')
      console.log(pe.render(error))

    }
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

process.on("unhandledRejection", (error) => {
  if (error) if (error.length > 950) error = error.slice(0, 950) + '... view console for details';
  if (error.stack) if (error.stack.length > 950) error.stack = error.stack.slice(0, 950) + '... view console for details';
  if (!error.stack) return
  const errorEmbed = new E()
    .setTitle(`⛔ unhandledRejection error`)
    .addFields([{ name: "Error", value: error ? codeBlock(error) : "No error" },
    { name: "Stack error", value: error.stack ? codeBlock(error.stack) : "No stack error" }]);
  console.log(pe.render(error))
  try {
    errorLogs.send({ embeds: [errorEmbed] })
  } catch {
    console.log('Error sending unhandledRejection to webhook')
    console.log(pe.render(error))
  }
})

process.on("uncaughtException", (error) => {
  if (error) if (error.length > 950) error = error.slice(0, 950) + '... view console for details';
  if (error.stack) if (error.stack.length > 950) error.stack = error.stack.slice(0, 950) + '... view console for details';
  if (!error.stack) return
  const errorEmbed = new E()
    .setTitle(`⛔ uncaughtException error`)
    .addFields([{ name: "Error", value: error ? codeBlock(error) : "No error" },
    { name: "Stack error", value: error.stack ? codeBlock(error.stack) : "No stack error" }]);
  console.log(pe.render(error))
  try {
    errorLogs.send({ embeds: [errorEmbed] })
  } catch {
    console.log('Error sending uncaughtException to webhook')
    console.log(pe.render(error))
  }
})

process.on("uncaughtExceptionMonitor", (error) => {
  if (error) if (error.length > 950) error = error.slice(0, 950) + '... view console for details';
  if (error.stack) if (error.stack.length > 950) error.stack = error.stack.slice(0, 950) + '... view console for details';
  if (!error.stack) return
  const errorEmbed = new E()
    .setTitle(`⛔ uncaughtExceptionMonitor error`)
    .addFields([{ name: "Error", value: error ? codeBlock(error) : "No error" },
    { name: "Stack error", value: error.stack ? codeBlock(error.stack) : "No stack error" }]);
  console.log(pe.render(error))
  try {
    errorLogs.send({ embeds: [errorEmbed] })
  } catch {
    console.log('Error sending uncaughtExceptionMonitor to webhook')
    console.log(pe.render(error))
  }
})

client.login(token);
