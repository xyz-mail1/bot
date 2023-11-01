const { Events } = require("discord.js");
const chalkAnimation = require("chalk-animation");
const shivie = require("chalk");
module.exports = {
  name: Events.ClientReady,
  once: true,
  execute: async (client) => {
    const time = new Date().toLocaleTimeString();
    console.log(shivie.green(`[${time}]`) + ` Logged in as ${client.user.tag}`);
  },
};
