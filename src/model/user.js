const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/sequelize');

const User = sequelize.define(
    'users',
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
    .then(() => console.log('The table for the User model was just (re)created!'));

module.exports = User;