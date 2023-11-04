
const Discord = require('discord.js');
const fetch = require("node-fetch");

module.exports = {
  name: "kiss",
  cooldown: 3,
  async execute(client, message, args) {
    const sender = message.author.id;
    const mention = message.mentions.users.first() || message.author;
    const target = mention.id;


    if (target) {
      client.incrementCount('kisses', sender, target);
      const count = await client.getCount('kisses', sender, target);
      const response = await fetch("https://purrbot.site/api/img/sfw/kiss/gif");
      const res = await response.json();
      const image = await res.link;
      const embed = new Discord.EmbedBuilder()
        .setColor('#ffb3b3')
        .setTitle("You gave a kiss!")
        .setURL("https://discord.com/invite/NQpTcs6r8z")
        .setDescription(`${message.author} kisses ${mention}`)
        .setImage(image);
      if (count === 1) {
        embed.setFooter({ text: `It's their first kiss from you!` });
      } else {
        embed.setFooter({ text: `That's a total of ${count} kisses now!` });
      }
      await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
    }
  },
}



