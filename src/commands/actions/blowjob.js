const Discord = require("discord.js");
const fetch = require("node-fetch");
const PurrBot = require("$purr/purr");
const api = new PurrBot();
module.exports = {
  name: "blowjob",
  aliases: ["bj"],
  cooldown: 3,
  SnM: true,
  run: async (client, message, args) => {
    const sender = message.author.id;
    const mention = message.mentions.users.first() || message.author;
    const target = mention.id;

    if (target) {
      client.incrementCount("blowjobs", sender, target);
      const count = await client.getCount("blowjobs", sender, target);
      const gif = await api.nsfw("blowjob");
      const embed = new Discord.EmbedBuilder()
        .setColor("#ffb3b3")
        .setTitle("You gave a blowjob!")
        .setURL("https://discord.com/invite/NQpTcs6r8z")
        .setDescription(`${message.author} gives ${mention} a blowjob`)
        .setImage(gif.link);
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
