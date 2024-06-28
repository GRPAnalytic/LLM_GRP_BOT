const User = require('../model/user');
// const { db } = require('../database/sqlite');

// const getByUserId = async (userId) => {
//   return new Promise((resolve, reject) => {
//     db.get('SELECT * FROM users WHERE teams_user_id = ?', [userId], (err, user) => {
//       if (err) return reject(err);
//       resolve(user);
//     })
//   })
// }

const getByUserId = async (userId) => {
  const user = await User.findOne({
    where: { teams_user_id: userId }
  });

  return user;
}

// const getById = async (id) => {
//   return new Promise((resolve, reject) => {
//     db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
//       if (err) return reject(err);
//       resolve(user);
//     })
//   })
// }

const getById = async (id) => {
  const user = await User.findByPk(id);
  return user;
}

// const create = async ({teams_user_id, name, context = '', included_tables = '[]', is_admin = 0}) => {
//   const query = 'INSERT INTO users (teams_user_id, name, context, included_tables, is_admin) VALUES (?, ?, ?, ?, ?)';
//   return new Promise((resolve, reject) => {
//     db.run(query, [teams_user_id, name, context, included_tables, is_admin], function(err) {
//       if (err) return reject(err);
//       resolve(this.lastID);
//     })
//   })
// }

const create = async (userInput) => { 
  const user = await User.create(userInput);
  return user.id;
}

// const updateByUserId = async (userId, { context, included_tables, is_admin }) => {
//   const query = 'UPDATE users SET context = ?, included_tables = ?, is_admin = ? WHERE teams_user_id = ?';
//   return new Promise((resolve, reject) => {
//     db.run(query, [context, included_tables, is_admin, userId], function(err) {
//       if (err) return reject(err);
//       resolve(this.changes);
//     })
//   })
// }

const updateByUserId = async (userId, userInput) => {
  await User.update(
    userInput,
    {
      where: { teams_user_id: userId }
    }
  );
}

module.exports = {
  getByUserId,
  getById,
  create,
  updateByUserId,
}