const { readdirSync } = require("node:fs");

module.exports = {
  name: "help",
  description: "help",
  aliases: ["h"],

  run: async (client, message, args) => {
    const roleColor =
      message.guild.members.me.displayHexColor === "#000000"
        ? "#ffffff"
        : message.guild.members.me.displayHexColor;

    if (!args[0]) {
      let categories = [];

      readdirSync("./src/commands/").forEach((dir) => {
        const commands = readdirSync(`./src/commands/${dir}/`).filter((file) =>
          file.endsWith(".js"),
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
      });
      client.embed(
        {
          title: `Here are all of my commands`,
          fields: categories,
          color: roleColor,
          type: "reply",
        },
        message,
      );
    } else {
      const command =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.find(
          (c) => c.aliases && c.aliases.includes(args[0].toLowerCase()),
        );
      if (!command) {
        return client.embed(
          {
            title: `Command not found`,
            type: "reply",
          },
          message,
        );
      }
      client.embed(
        {
          title: `Command details`,
          fields: [
            {
              name: `COMMAND: `,
              value: command.name
                ? `\`${command.name}\``
                : "No name for this command.",
            },
            {
              name: `ALIASES: `,
              value: command.aliases
                ? `\`${command.aliases.join("` `")}\``
                : "No aliases for this command.",
            },
          ],
          type: "reply",
        },
        message,
      );
    }
  },
};
