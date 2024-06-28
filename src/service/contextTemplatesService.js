// const { db } = require('../database/sqlite');
const AvailableTable = require('../model/availableTable');
const ContextTemplate = require('../model/contextTemplate');

// const create = async ({ context = '', included_tables = '[]', name = '' }) => {
// 	const query = 'INSERT INTO context_templates (name, context, included_tables) VALUES (?, ?, ?)';
// 	return new Promise((resolve, reject) => {
// 		db.run(query, [name, context, included_tables], function (err) {
// 			if (err) return reject(err);
// 			resolve(this.lastID);
// 		});
// 	});
// };

const create = async (contextTemplateInput) => {
	const contextTemplate = await ContextTemplate.create(contextTemplateInput);
	return contextTemplate;
};

// const read = async (page = 0, limit = 5) => {
// 	return new Promise((resolve, reject) => {
// 		db.all(
// 			'SELECT * FROM context_templates ORDER BY ID ASC LIMIT ? OFFSET ?',
// 			[limit, limit * page],
// 			(err, rows) => {
// 				if (err) return reject(err);
// 				resolve(rows);
// 			},
// 		);
// 	});
// };

const read = async (page = 0, limit = 5) => {
	const contextTemplates = await ContextTemplate.findAndCountAll({
		limit,
		offset: page * limit,
	});
	return contextTemplates.rows;
};

// const getById = async (id) => {
// 	return new Promise((resolve, reject) => {
// 		db.get('SELECT * FROM context_templates WHERE id = ?', [id], (err, contextTemplate) => {
// 			if (err) return reject(err);
// 			resolve(contextTemplate);
// 		});
// 	});
// };

const getById = async (id) => {
	const contextTemplate = await ContextTemplate.findByPk(id);
	return contextTemplate;
};

// const remove = async (id) => {
//     const query = 'DELETE FROM context_templates WHERE id = ?';
//     return new Promise((resolve, reject) => {
//         db.run(query, [id], function(err) {
//             if (err) return reject(err);
//             resolve(this.changes);
//         })
//     })
// }

const remove = async (id) => {
	await ContextTemplate.destroy({ where: { id } });
};

// const update = async (id, { context, included_tables, name }) => {
// 	const query = 'UPDATE context_templates SET context = ?, included_tables = ?, name = ? WHERE id = ?';
// 	return new Promise((resolve, reject) => {
// 		db.run(query, [context, included_tables, name, id], function (err) {
// 			if (err) return reject(err);
// 			resolve(this.changes);
// 		});
// 	});
// };

const update = async (id, contextTemplateInput) => {
	await ContextTemplate.update(contextTemplateInput, {
		where: { id }
	});
}

// const all = async () => {
// 	return new Promise((resolve, reject) => {
// 		db.all('SELECT * FROM context_templates ORDER BY ID ASC', [], (err, rows) => {
// 			if (err) return reject(err);
// 			resolve(rows);
// 		});
// 	});
// };

const all = async () => {
	const contextTemplates = await ContextTemplate.findAll()
	return contextTemplates;
}

module.exports = {
	create,
	read,
	getById,
	remove,
	update,
	all,
};
