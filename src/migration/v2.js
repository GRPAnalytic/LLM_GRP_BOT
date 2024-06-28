const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('bot.db');

const dbCallback = (success) => {
	return (err) => {
		if (err) return console.log(err.stack);
		console.log(success);
	};
};

const migrate = () => {
  db.run('ALTER TABLE users ADD COLUMN is_admin INTEGER', dbCallback('Table users updated'));
  db.close();
}

module.exports = {
  migrate
}