require("dotenv").config();

const { WebhookClient: W, EmbedBuilder: E } = require("discord.js"),
  token = process.env.token,
  BotClient = require("./src/structures/bot"),
  client = new BotClient();

client.loadHandlers();

var PrettyError = require("pretty-error");
const pe = new PrettyError();
pe.start();
const errorLogs = new W({ url: `${process.env.errorHook}` });

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
