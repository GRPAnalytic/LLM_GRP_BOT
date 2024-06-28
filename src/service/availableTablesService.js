// const { db } = require('../database/sqlite');
const AvailableTable = require('../model/availableTable');

// const read = async (page = 0, limit = 5) => {
//     return new Promise((resolve, reject) => {
//         db.all('SELECT * FROM available_tables ORDER BY ID ASC LIMIT ? OFFSET ?', [limit, limit * page], (err, rows) => {
//             if (err) return reject(err);
//             resolve(rows);
//         })
//     })
// }

const read = async (page = 0, limit = 5) => {
    const availableTables = await AvailableTable.findAndCountAll({
        offset: page * limit,
        limit,
    });

    return availableTables.rows;
}

// const create = async (name) => {
//     const query = 'INSERT INTO available_tables (name) VALUES (?)';
//     return new Promise((resolve, reject) => {
//         db.run(query, [name], function(err) {
//             if (err) return reject(err);
//             resolve(this.lastID);
//         })
//     })
// }

const create = async (availableTableInput) => {
    const availableTable = await AvailableTable.create(availableTableInput);
    return availableTable.id;
}

// const remove = async (id) => {
//     const query = 'DELETE FROM available_tables WHERE id = ?';
//     return new Promise((resolve, reject) => {
//         db.run(query, [id], function(err) {
//             if (err) return reject(err);
//             resolve(this.changes);
//         })
//     })
// }

const remove = async (id) => {
    await AvailableTable.destroy({
        where: { id }
    });
}

// const getNameList = async () => {
//     return new Promise((resolve, reject) => {
//         db.all('SELECT DISTINCT name from available_tables', [], (err, rows) => {
//             if (err) return reject(err);
//             const names = rows.map(row => row.name);
//             resolve(names);
//         })
//     })
// }

const getNameList = async () => {
    const availableTables = await AvailableTable.findAll({});
    const names = availableTables.map(row => row.name);
    return names;
}

module.exports = {
    read,
    create,
    remove,
    getNameList,
}