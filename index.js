const dotenv = require("dotenv");
dotenv.config();
const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    WebhookClient: W,
    EmbedBuilder: E,
    codeBlock,
  } = require("discord.js"),
  chalkAnimation = require("chalk-animation"),
  fs = require("node:fs"),
  path = require("node:path"),
  client = new Client({
    intents: [
      GatewayIntentBits.AutoModerationConfiguration,
      GatewayIntentBits.AutoModerationExecution,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.DirectMessageTyping,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildModeration,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildScheduledEvents,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.MessageContent,
    ],
    partials: [
      Partials.Message,
      Partials.Channel,
      Partials.GuildMember,
      Partials.Reaction,
      Partials.GuildScheduledEvent,
      Partials.User,
      Partials.ThreadMember,
    ],
    shards: "auto",
  }),
  token = process.env.token;
const maggie = require("chalk");
var PrettyError = require("pretty-error");
var pe = new PrettyError();
const time = new Date().toLocaleTimeString();
console.log(maggie.green(`[${time}]`) + ` Starting...`);

client.commands = new Collection();
client.cooldowns = new Collection();
client.slash = new Collection();

const errorLogs = new W({ url: `${process.env.errorHook}` });
const folderPath = "./src/handlers/";
const handlers = fs
  .readdirSync(folderPath)
  .sort((a, b) => +a.match(/\d+/) - +b.match(/\d+/));

const loadedFiles = [];

for (const file of handlers) {
  require(`./src/handlers/${file}`)(client);
  const handler = file.replace(".js", "");
  loadedFiles.push({
    handler,
    loadedAt: new Date().toLocaleTimeString(),
  });
}

console.table(
  loadedFiles.map((fileInfo) => ({
    handler: fileInfo.handler.replace(/"/g, ``),
    loadedAt: fileInfo.loadedAt,
  })),
);

process.on("unhandledRejection", (error) => {
  if (error)
    if (error.length > 950)
      error = error.slice(0, 950) + "... view console for details";
  if (error.stack)
    if (error.stack.length > 950)
      error.stack = error.stack.slice(0, 950) + "... view console for details";
  if (!error.stack) return;
  const errorEmbed = new E().setTitle(`⛔ unhandledRejection error`).addFields([
    { name: "Error", value: error ? codeBlock(error) : "No error" },
    {
      name: "Stack error",
      value: error.stack ? codeBlock(error.stack) : "No stack error",
    },
  ]);
  console.log(pe.render(error));
  try {
    errorLogs.send({ embeds: [errorEmbed] });
  } catch {
    console.log("Error sending unhandledRejection to webhook");
    console.log(pe.render(error));
  }
});

process.on("uncaughtException", (error) => {
  if (error)
    if (error.length > 950)
      error = error.slice(0, 950) + "... view console for details";
  if (error.stack)
    if (error.stack.length > 950)
      error.stack = error.stack.slice(0, 950) + "... view console for details";
  if (!error.stack) return;
  const errorEmbed = new E().setTitle(`⛔ uncaughtException error`).addFields([
    { name: "Error", value: error ? codeBlock(error) : "No error" },
    {
      name: "Stack error",
      value: error.stack ? codeBlock(error.stack) : "No stack error",
    },
  ]);
  console.log(pe.render(error));
  try {
    errorLogs.send({ embeds: [errorEmbed] });
  } catch {
    console.log("Error sending uncaughtException to webhook");
    console.log(pe.render(error));
  }
});

process.on("uncaughtExceptionMonitor", (error) => {
  if (error)
    if (error.length > 950)
      error = error.slice(0, 950) + "... view console for details";
  if (error.stack)
    if (error.stack.length > 950)
      error.stack = error.stack.slice(0, 950) + "... view console for details";
  if (!error.stack) return;
  const errorEmbed = new E()
    .setTitle(`⛔ uncaughtExceptionMonitor error`)
    .addFields([
      { name: "Error", value: error ? codeBlock(error) : "No error" },
      {
        name: "Stack error",
        value: error.stack ? codeBlock(error.stack) : "No stack error",
      },
    ]);
  console.log(pe.render(error));
  try {
    errorLogs.send({ embeds: [errorEmbed] });
  } catch {
    console.log("Error sending uncaughtExceptionMonitor to webhook");
    console.log(pe.render(error));
  }
});

client.login(token);
