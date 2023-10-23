const { Events, InteractionType } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  execute: async (interaction) => {
    let client = interaction.client;
    if (!interaction.isChatInputCommand()) return;

    const command = client.slash.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.run(client, interaction);
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
        console.log('Error sending slash command log to webhook')
        console.log(pe.render(error))

      }
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  }
}
