const dotenv = require("dotenv");
dotenv.config();
const {
  Client,
  GatewayIntentBits: GB,
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
      GB.AutoModerationConfiguration,
      GB.AutoModerationExecution,
      GB.DirectMessageReactions,
      GB.DirectMessageTyping,
      GB.DirectMessages,
      GB.GuildEmojisAndStickers,
      GB.GuildIntegrations,
      GB.GuildInvites,
      GB.GuildMembers,
      GB.GuildMessageReactions,
      GB.GuildMessageTyping,
      GB.GuildMessages,
      GB.GuildModeration,
      GB.GuildPresences,
      GB.GuildScheduledEvents,
      GB.GuildVoiceStates,
      GB.GuildWebhooks,
      GB.Guilds,
      GB.MessageContent,
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

var PrettyError = require("pretty-error");
var pe = new PrettyError();

console.clear();
chalkAnimation.rainbow("Starting...");

client.commands = new Collection();
client.cooldowns = new Collection();
client.slash = new Collection();

const errorLogs = new W({ url: `${process.env.errorHook}` });

const handlers = fs.readdirSync("./src/handlers/");

for (const file of handlers) {
  require(`./src/handlers/${file}`)(client);
}

process.on("unhandledRejection", (error) => {
  const errorMessage =
    error.message.length > 950
      ? `${error.message.slice(0, 950)}...`
      : error.message;
  const stackTrace = error.stack
    ? error.stack.length > 950
      ? `${error.stack.slice(0, 950)}...`
      : error.stack
    : "No stack error";

  const errorEmbed = new E().setTitle(`⛔ unhandledRejection error`).addFields([
    { name: "Error", value: errorMessage },
    {
      name: "Stack error",
      value: `\`\`\`\n${stackTrace}\n\`\`\``,
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
  const errorMessage =
    error.message.length > 950
      ? `${error.message.slice(0, 950)}.. `
      : error.message;
  const stackTrace = error.stack
    ? error.stack.length > 950
      ? `${error.stack.slice(0, 950)}...`
      : error.stack
    : "No stack error";
  const errorEmbed = new E().setTitle(`⛔ uncaughtException error`).addFields([
    { name: "Error", value: errorMessage },
    {
      name: "Stack error",
      value: `\`\`\`\n${stackTrace}\n\`\`\``,
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

client.login(token);
