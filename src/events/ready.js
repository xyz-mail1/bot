const { Events } = require("discord.js");
const chalkAnimation = require("chalk-animation");
module.exports = {
  name: Events.ClientReady,
  once: true,
  execute: async (client) => {
    console.log(new Date().toLocaleTimeString());
    chalkAnimation.rainbow(`Ready! Logged in as ${client.user.tag}`);
  },
};
