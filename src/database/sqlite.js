const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('bot.db');

const dbCallback = (success) => {
	return (err) => {
		if (err) return console.log(err.stack);
		console.log(success);
	};
};

db.run(
	`
    CREATE TABLE IF NOT EXISTS available_tables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `,
  dbCallback('Created available_tables'),
);

db.run(
	`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      teams_user_id TEXT NOT NULL,
      context TEXT,
      included_tables TEXT,
      is_admin INTEGER
    )
  `,
  dbCallback('Created users'),
);

db.run(
	`
    CREATE TABLE IF NOT EXISTS context_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      context TEXT,
      included_tables TEXT
    )
  `,
  dbCallback('Created context_templates'),
);

module.exports = {
	db,
};
