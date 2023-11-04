
const Discord = require('discord.js');
const pluralize = require('pluralize');
//const db = require('$db/bite.js');
const fetch = require("node-fetch");

module.exports = {
  name: "bite",
  cooldown: 3,
  async execute(client, message, args) {
    const a = pluralize(this.name);
    const sender = message.author.id;
    const mention = message.mentions.users.first();
    const target = mention.id;
    if (target) {
      client.incrementCount('bites', sender, target);
      const count = await client.getCount('bites', sender, target);
      const response = await fetch("https://purrbot.site/api/img/sfw/bite/gif");
      const res = await response.json();
      const image = await res.link;
      const embed = new Discord.EmbedBuilder()
        .setColor('#ffb3b3')
        .setTitle("You gave a bite!")
        .setURL("https://discord.com/invite/NQpTcs6r8z")
        .setDescription(`${message.author} bites ${mention}`)
        .setImage(image);
      if (count === 1) {
        embed.setFooter({ text: `It's their first bite from you!` });
      } else {
        embed.setFooter({ text: `That's a total of ${count} bites now!` });
      }
      await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
    } else {
      message.reply('You need to mention someone to kiss!');
    }
  },
}



