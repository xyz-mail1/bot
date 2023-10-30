const { readdirSync } = require("node:fs");

module.exports = {
  name: 'help',
  description: 'help',
  aliases: ['h'],

  async execute(client, message, args) {
    const roleColor =
      message.guild.members.me.displayHexColor === "#000000"
        ? "#ffffff"
        : message.guild.members.me.displayHexColor;

    if (!args[0]) {
      let categories = [];

      readdirSync("./commands/").forEach((dir) => {
        const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
          file.endsWith(".js")
        );

        const cmds = commands.map((command) => {
          let file = require(`../../commands/${dir}/${command}`);

          if (!file.name) return "No command name.";

          let name = file.name.replace(".js", "");

          return `\`${name}\``;
        });

        let data = new Object();

        data = {
          name: dir.toUpperCase(),
          value: cmds.length === 0 ? "In progress." : cmds.join(" "),
        };

        categories.push(data);
      })
      client.embed({
        title: `Here are all of my commands`,
        fields: categories,
        color: roleColor,
        type: 'reply'
      }, message);
    }
  }
}
