
const { Client, GatewayIntentBits } = require('discord.js');
const betterSqlite3 = require('better-sqlite3');
const pluralize = require('pluralize');
const db = new betterSqlite3('main.db');


// Create a table to store hug data
const createTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS kisses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT,
    target TEXT,
    count INTEGER
  )
`);
createTable.run();
module.exports = {
  name: "kiss",
  cooldown: 3,
  execute(client, message, args) {
    const a = pluralize(this.name);
    const sender = message.author.id;
    const target = message.mentions.users.first();
    if (target) {


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
        message.reply(`*${a} ${target}* (Kiss Count: ${entry.count + 1})`);
      } else if (reverseEntry) {
        // Increment count for target hugging sender
        const updateReverseCount = db.prepare(`UPDATE ${a} SET count = count + 1 WHERE sender = ? AND target = ?`);
        updateReverseCount.run(target.id, sender);
        message.reply(`*${a} ${target}* (Kiss Count: ${reverseEntry.count + 1})`);
      } else {
        // Initialize count to 1 for new hug entries
        const insert = db.prepare(`INSERT INTO ${a} (sender, target, count) VALUES (?, ?, ?)`);
        insert.run(sender, target.id, 1);
        message.reply(`*kisses ${target}* (Kiss Count: 1)`);
      }
    } else {
      message.reply('You need to mention someone to kiss!');
    }
  },
}



