const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "blowjob",
  aliases: ["bj"],
  cooldown: 3,
  SnM: true,
  async execute(client, message, args) {
    const sender = message.author.id;
    const mention = message.mentions.users.first() || message.author;
    const target = mention.id;

    if (target) {
      client.incrementCount("blowjobs", sender, target);
      const count = await client.getCount("blowjobs", sender, target);
      const response = await fetch(
        "https://purrbot.site/api/img/nsfw/blowjob/gif",
      );
      const res = await response.json();
      const image = await res.link;
      const embed = new Discord.EmbedBuilder()
        .setColor("#ffb3b3")
        .setTitle("You gave a blowjob!")
        .setURL("https://discord.com/invite/NQpTcs6r8z")
        .setDescription(`${message.author} gives ${mention} a blowjob`)
        .setImage(image);
      if (count === 1) {
        embed.setFooter({ text: `It's their first blowjob from you!` });
      } else {
        embed.setFooter({ text: `That's a total of ${count} blowjobs now!` });
      }
      await message.reply({
        embeds: [embed],
        allowedMentions: { repliedUser: false },
      });
    }
  },
};
