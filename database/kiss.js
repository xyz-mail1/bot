const sqlite = require('better-sqlite3');
const db = new sqlite(`../main.db`);

db.exec(`
  CREATE TABLE IF NOT EXISTS kisses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT,
    target TEXT,
    count INTEGER
  )
`);

module.exports = {
  incrementCount: (sender, target) => {
    const select = db.prepare(`SELECT * FROM kisses WHERE ( sender = ? AND target = ?) OR ( sender = ? AND target = ?)`);
    const entry = select.get(sender, target, target, sender);
    if (entry) {
      const updateCount = db.prepare(`UPDATE kisses SET count = count + 1 WHERE ( sender = ? AND target = ?) OR ( sender = ? AND target = ? )`);
      updateCount.run(sender, target, target, sender);
    } else {
      const insert = db.prepare(`INSERT INTO kisses (sender, target, count) VALUES (?, ?, ?)`);
      insert.run(sender, target, 1);
    }
  },

  getCount: (sender, target) => {
    const stmt = db.prepare('SELECT count FROM kisses WHERE (sender = ? AND target = ?) OR (sender = ? AND target = ?)');
    const result = stmt.all(sender, target, target, sender);

    return result.reduce((total, row) => total + row.count, 0);
  },
};



