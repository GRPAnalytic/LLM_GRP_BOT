const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/sequelize');

const AvailableTable = sequelize.define(
    'bot_available_table',
    {
        name: {
            type: DataTypes.STRING,
        },
    }
);

AvailableTable.sync({ alter: true })
    .then(() => console.log('The table for the AvailableTable model was just (re)created!'))
    .catch(error => console.error('Error syncing the AvailableTable model:', error));

module.exports = AvailableTable;