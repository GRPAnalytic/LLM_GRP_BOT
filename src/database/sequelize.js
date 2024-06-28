const { Sequelize } = require('sequelize');

console.log('process.env.CONNECTION_STRING :>> ', process.env.CONNECTION_STRING);

// const sequelize = new Sequelize(
//     process.env.CONNECTION_STRING,
//     { logging: console.log, },
// ); // Example for postgres

const sequelize = new Sequelize({
	dialect: 'mssql',
	host: process.env.SQL_SERVER + '.database.windows.net',
	port: 1433,
	database: process.env.SQL_DB,
	username: process.env.SQL_USERNAME,
	password: process.env.SQL_PWD,
	dialectOptions: {
	  options: {
		encrypt: true,
		trustServerCertificate: false,
		connectionTimeout: 30000
	  }
	},
	logging: console.log,
  });

const health = async () => {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
		return 'Connection has been established successfully.';
	} catch (error) {
		console.error('Unable to connect to the database:', error);
		return 'Connection has been established successfully. ' + error;
	}
};

module.exports = {
	health,
	sequelize,
};
