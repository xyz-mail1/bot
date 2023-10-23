
const { Client, GatewayIntentBits } = require('discord.js');
const betterSqlite3 = require('better-sqlite3');
const db = new betterSqlite3('hug_data.db');


// Create a table to store hug data
const createHugsTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS hugs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT,
    target TEXT,
    count INTEGER
  )
`);
createHugsTable.run();
module.exports = {
  name: "hug",
  execute(client, message, args) {
    const sender = message.author.id;
    const target = message.mentions.users.first();
    if (target) {


      // Check if hug data exists for the sender hugging the target
      const selectHug = db.prepare("SELECT * FROM hugs WHERE sender = ? AND target = ?");
      const hugEntry = selectHug.get(sender, target.id);

      // Check if hug data exists for the target hugging the sender
      const reverseSelectHug = db.prepare("SELECT * FROM hugs WHERE sender = ? AND target = ?");
      const reverseHugEntry = reverseSelectHug.get(target.id, sender);

      if (hugEntry) {
        // Increment count for sender hugging target
        const updateHugCount = db.prepare("UPDATE hugs SET count = count + 1 WHERE sender = ? AND target = ?");
        updateHugCount.run(sender, target.id);
        message.reply(`*hugs ${target}* (Hug Count: ${hugEntry.count + 1})`);
      } else if (reverseHugEntry) {
        // Increment count for target hugging sender
        const updateReverseHugCount = db.prepare("UPDATE hugs SET count = count + 1 WHERE sender = ? AND target = ?");
        updateReverseHugCount.run(target.id, sender);
        message.reply(`*hugs ${target}* (Hug Count: ${reverseHugEntry.count + 1})`);
      } else {
        // Initialize count to 1 for new hug entries
        const insertHug = db.prepare("INSERT INTO hugs (sender, target, count) VALUES (?, ?, ?)");
        insertHug.run(sender, target.id, 1);
        message.reply(`*hugs ${target}* (Hug Count: 1)`);
      }
    } else {
      message.reply('You need to mention someone to hug!');
    }
  },
}



