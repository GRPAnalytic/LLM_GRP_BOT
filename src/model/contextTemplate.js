const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/sequelize');

const ContextTemplate = sequelize.define(
    'context_templates',
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
    .then(() => console.log('The table for the ContextTemplate model was just (re)created!'));

module.exports = ContextTemplate;