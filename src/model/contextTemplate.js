const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/sequelize');

const ContextTemplate = sequelize.define(
    'bot_context_template',
    {
        context: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        included_tables: {
            type: DataTypes.STRING,

        },
    }
);

ContextTemplate.sync({ alter: true })
    .then(() => console.log('The table for the ContextTemplate model was just (re)created!'))
    .catch(error => console.error('Error syncing the ContextTemplate model:', error));

module.exports = ContextTemplate;