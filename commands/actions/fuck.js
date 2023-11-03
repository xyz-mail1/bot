const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "fuck",
  cooldown: 3,
  SnM: true,
  async execute(client, message, args) {
    const sender = message.author.id;
    const mention = message.mentions.users.first() || message.author;
    const target = mention.id;

    if (target) {
      client.incrementCount("fucks", sender, target);
      const count = await client.getCount("fucks", sender, target);
      const response = await fetch(
        "https://purrbot.site/api/img/nsfw/fuck/gif",
      );
      const res = await response.json();
      const image = await res.link;
      const embed = new Discord.EmbedBuilder()
        .setColor("#ffb3b3")
        .setTitle("You gave a fuck!")
        .setURL("https://discord.com/invite/NQpTcs6r8z")
        .setDescription(`${message.author} fucks ${mention}`)
        .setImage(image);
      if (count === 1) {
        embed.setFooter({ text: `It's their first fuck from you!` });
      } else {
        embed.setFooter({ text: `That's a total of ${count} fucks now!` });
      }
      await message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      });
    }
  },
};
