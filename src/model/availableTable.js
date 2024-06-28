const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/sequelize');

const AvailableTable = sequelize.define(
    'available_tables',
    {
        name: {
            type: DataTypes.STRING,
        },
    }
);

AvailableTable.sync({ alter: true })
    .then(() => console.log('The table for the AvailableTable model was just (re)created!'));

module.exports = AvailableTable;