const { Events } = require("discord.js");
const chalkAnimation = require("chalk-animation")
module.exports = {
  name: Events.ClientReady,
  once: true,
  execute: async (client) => {
    chalkAnimation.neon(`\nReady! Logged in as ${client.user.tag}`);
  }
}
