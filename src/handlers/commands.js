const fs = require("fs");

module.exports = (client) => {
  const commandFolders = fs.readdirSync("./src/commands");

  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./src/commands/${folder}`)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      try {
        const command = require(`../commands/${folder}/${file}`);
        client.commands.set(command.name, command);
      } catch (err) {
        client.logger.error(`Failed to load ${file} Reason: ${err.message}`);
      }
    }
  }
};
