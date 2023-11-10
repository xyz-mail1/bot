const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute: async (client) => {
    client.logger.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
