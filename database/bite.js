const sqlite = require('better-sqlite3');
const db = new sqlite(`../main.db`);
// Create table
db.exec(`
  CREATE TABLE IF NOT EXISTS bites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT,
    target TEXT,
    count INTEGER
  )
`);

module.exports = {
  incrementCount: (sender, target) => {
    // Check if entry for the users already exists in the db
    const select = db.prepare(`SELECT * FROM bites WHERE ( sender = ? AND target = ?) OR ( sender = ? AND target = ?)`);
    const entry = select.get(sender, target, target, sender);
    if (entry) {
      const updateCount = db.prepare(`UPDATE bites SET count = count + 1 WHERE ( sender = ? AND target = ?) OR ( sender = ? AND target = ? )`);
      updateCount.run(sender, target, target, sender);
    }
    // Create new entry in the db if the entry doesn't exist
    else {
      const insert = db.prepare(`INSERT INTO bites (sender, target, count) VALUES (?, ?, ?)`);
      insert.run(sender, target, 1);
    }
  },
  // Get the number of bites 
  getCount: (sender, target) => {
    const stmt = db.prepare('SELECT count FROM bites WHERE (sender = ? AND target = ?) OR (sender = ? AND target = ?)');
    const result = stmt.all(sender, target, target, sender);

    return result.reduce((total, row) => total + row.count, 0);
  },
};



