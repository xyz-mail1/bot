const fs = require("node:fs");

module.exports = (client) => {
  const commandFolders = fs.readdirSync("./slash");
  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./slash/${folder}`)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`../../slash/${folder}/${file}`);
      client.slash.set(command.data.name, command);
    }
  }
};
