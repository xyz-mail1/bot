require("dotenv").config();
require("better-module-alias")(__filename, {
  $purr: "./wrapper/purr.js",
});
const token = process.env.token,
  BotClient = require("./src/structures/bot"),
  client = new BotClient();

client.loadHandlers();

process.on("unhandledRejection", (err) =>
  client.logger.error(`Unhandled exception`, err),
);
process.on("uncaughtException", (err) =>
  client.logger.error(`Uncaught Exception`, err),
);

client.login(token);
