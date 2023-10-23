const { Collection, Events, EmbedBuilder: E, WebhookClient: W } = require('discord.js');
const cooldowns = new Collection();
const errorLogs = new W({ url: `${process.env.errorHook}` })
const prefix = "!"
module.exports = {
  name: Events.MessageCreate,
  execute: async (message) => {
    let client = message.client;
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

  }
}