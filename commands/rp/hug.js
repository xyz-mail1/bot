
const { EmbedBuilder: EB } = require('discord.js');
const betterSqlite3 = require('better-sqlite3');
const db = new betterSqlite3('../../main.db');
var pluralize = require("pluralize")
const fetch = require("node-fetch");

// Create a table to store hug data
const createTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS hugs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT,
    target TEXT,
    count INTEGER
  )
`);
createTable.run();
module.exports = {
  name: "hug",
  cooldown: 3,
  async execute(client, message, args) {
    try {
      const a = pluralize(this.name);
      const sender = message.author.id;
      const target = message.mentions.members.first();
      if (target) {
        const response = await fetch("https://nekos.life/api/v2/img/hug")
        const result = await response.json();
        const image = await result.url;

        const author = await message.member.displayName;
        const hugged = await target.displayName;
        const embed = new EB()
          .setColor('#ffb3b3')
          .setTitle("You gave a hug!")
          .setURL("https://discord.com/invite/NQpTcs6r8z")
          .setDescription(`${message.author} hugs ${target}`)
          .setImage(image);


        // Check if hug data exists for the sender hugging the target
        const select = db.prepare(`SELECT * FROM ${a} WHERE sender = ? AND target = ?`);
        const entry = select.get(sender, target.id);

        // Check if hug data exists for the target hugging the sender
        const reverseSelect = db.prepare(`SELECT * FROM ${a} WHERE sender = ? AND target = ?`);
        const reverseEntry = reverseSelect.get(target.id, sender);

        if (entry) {
          // Increment count for sender hugging target
          const updateCount = db.prepare(`UPDATE ${a} SET count = count + 1 WHERE sender = ? AND target = ?`);
          updateCount.run(sender, target.id);
          embed.setFooter({ text: `That's ${entry.count + 1} ${a} now!` });
          message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        } else if (reverseEntry) {
          // Increment count for target hugging sender
          const updateReverseCount = db.prepare(`UPDATE ${a} SET count = count + 1 WHERE sender = ? AND target = ?`);
          updateReverseCount.run(target.id, sender);
          embed.setFooter({ text: `That's ${reverseEntry.count + 1} ${a} now!` });
          message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        } else {
          // Initialize count to 1 for new hug entries
          const insert = db.prepare(`INSERT INTO ${a} (sender, target, count) VALUES (?, ?, ?)`);
          insert.run(sender, target.id, 1);
          embed.setFooter({ text: `Their first hug from you!` });
          message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        }
      } else {
        message.reply('You need to mention someone to hug!');
      }
    } catch (err) {
      console.log(pe.render(err))
    }
  },
}



