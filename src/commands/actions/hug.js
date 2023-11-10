const Discord = require("discord.js");
const pluralize = require("pluralize");
//const db = require('$db/bite.js');
const fetch = require("node-fetch");

module.exports = {
  name: "hug",
  cooldown: 3,
  run: async (client, message, args) => {
    const a = pluralize(this.name);
    const sender = message.author.id;
    const mention = message.mentions.users.first() || message.author;
    const target = mention.id;

    if (target) {
      client.incrementCount("hugs", sender, target);
      const count = await client.getCount("hugs", sender, target);
      const response = await fetch("https://purrbot.site/api/img/sfw/hug/gif");
      const res = await response.json();
      const image = await res.link;
      const embed = new Discord.EmbedBuilder()
        .setColor("#ffb3b3")
        .setTitle("You gave a hug!")
        .setURL("https://discord.com/invite/NQpTcs6r8z")
        .setDescription(`${message.author} bites ${mention}`)
        .setImage(image);
      if (count === 1) {
        embed.setFooter({ text: `It's their first hug from you!` });
      } else {
        embed.setFooter({ text: `That's a total of ${count} hugs now!` });
      }
      await message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      });
    }
  },
};
