const sqlite = require("better-sqlite3");
const db = new sqlite(`../../main.db`);

// Create a table
db.exec(`
  CREATE TABLE IF NOT EXISTS counts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    variable TEXT,
    sender TEXT,
    target TEXT,
    count INTEGER
  )
`);

module.exports = (client) => {
  client.incrementCount = async function (variable, sender, target) {
    // Check if entry for the users already exists in the db
    const select = db.prepare(
      `SELECT * FROM counts WHERE (variable = ? AND sender = ? AND target = ?) OR (variable = ? AND sender = ? AND target = ?)`,
    );
    const entry = await select.get(
      variable,
      sender,
      target,
      variable,
      target,
      sender,
    );
    if (entry) {
      const updateCount = db.prepare(
        `UPDATE counts SET count = count + 1 WHERE (variable = ? AND sender = ? AND target = ?) OR (variable = ? AND sender = ? AND target = ?)`,
      );
      updateCount.run(variable, sender, target, variable, target, sender);
    } else {
      const insert = db.prepare(
        `INSERT INTO counts (variable, sender, target, count) VALUES (?, ?, ?, ?)`,
      );
      insert.run(variable, sender, target, 1);
    }
  };

  client.getCount = async function (variable, sender, target) {
    const stmt = db.prepare(
      "SELECT count FROM counts WHERE (variable = ? AND sender = ? AND target = ?) OR (variable = ? AND sender = ? AND target = ?)",
    );
    const result = await stmt.all(
      variable,
      sender,
      target,
      variable,
      target,
      sender,
    );

    return result.reduce((total, row) => total + row.count, 1);
  };
};
