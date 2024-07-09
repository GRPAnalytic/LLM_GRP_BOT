const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/sequelize');

const User = sequelize.define(
    'bot_user',
    {
        teams_user_id: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        is_admin: {
            type: DataTypes.BOOLEAN,

        },
    }
);

User.sync({ alter: true })
    .then(() => console.log('The table for the User model was just (re)created!'))
    .catch(error => console.error('Error syncing the User model:', error));

module.exports = User;