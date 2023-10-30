const sqlite = require('better-sqlite3');
const db = new sqlite(`../main.db`);

db.exec(`
  CREATE TABLE IF NOT EXISTS bites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT,
    target TEXT,
    count INTEGER
  )
`);

module.exports = {
  incrementEitherBiteCount: (sender, target) => {
    const select = db.prepare(`SELECT * FROM bites WHERE ( sender = ? AND target = ?) OR ( sender = ? AND target = ?)`);
    const entry = select.get(sender, target, target, sender);
    if (entry) {
      const updateCount = db.prepare(`UPDATE bites SET count = count + 1 WHERE ( sender = ? AND target = ?) OR ( sender = ? AND target = ? )`);
      updateCount.run(sender, target, target, sender);
    } else {
      const insert = db.prepare(`INSERT INTO bites (sender, target, count) VALUES (?, ?, ?)`);
      insert.run(sender, target, 1);
    }
    //const stmt = db.prepare('INSERT OR REPLACE INTO bites (sender, target, count) VALUES (?, ?, COALESCE((SELECT count FROM bites WHERE (sender = ? AND target = ?) OR (sender = ? AND target = ?), 0) + 1)').get(sender, target, target, sender, sender, target);
    //stmt.run(sender, target, target, sender, sender, target);
  },

  getEitherBiteCount: (sender, target) => {
    const stmt = db.prepare('SELECT count FROM bites WHERE (sender = ? AND target = ?) OR (sender = ? AND target = ?)');
    const result = stmt.all(sender, target, target, sender);

    return result.reduce((total, row) => total + row.count, 0);
  },
};



