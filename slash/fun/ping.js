const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  run: async (client, interaction) => {
    await interaction.reply({
      content: 'Pong! ' + client.ws.ping
    });
  },
};

