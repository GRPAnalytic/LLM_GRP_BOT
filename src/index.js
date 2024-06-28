// Create HTTP server.
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });
const restify = require('restify');
const { commandApp } = require('./internal/initialize');
const { TeamsBot } = require('./teamsBot');
const { sendAdaptiveCard } = require('@microsoft/teamsfx');
const { sendTableCard, sendAddTableCard, sendDeleteTableCard } = require('./utils/tableCardUtil');
const availableTableService = require('./service/availableTablesService');
const userService = require('./service/usersService');
const contextTemplatesService = require('./service/contextTemplatesService');
const config = require('./internal/config');
const { isActionAllowed } = require('./utils/authUtil');
const {
	sendListContextTemplateCard,
	sendAddContextTemplateCard,
	sendEditContextTemplateCard,
} = require('./utils/contextTemplateCardUtil');
const { postQuestion } = require('./service/grpLangchainService');
const answerCard = require('./adaptiveCards/answerCard.json');
const { AdaptiveCards } = require('@microsoft/adaptivecards-tools');
const { CardFactory } = require('botbuilder');
const { health } = require('./database/sequelize');
const { sendStartMenuCard } = require('./utils/startMenuUtil');
const { sendAskCard } = require('./utils/askCardUtil');

health();

// This template uses `restify` to serve HTTP responses.
// Create a restify server.
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.listen(process.env.port || process.env.PORT || 3978, () => {
	console.log(`\nApp Started, ${server.name} listening to ${server.url}`);
});

// Register an API endpoint with `restify`. Teams sends messages to your application
// through this endpoint.
//
// The Teams Toolkit bot registration configures the bot with `/api/messages` as the
// Bot Framework endpoint. If you customize this route, update the Bot registration
// in `templates/azure/provision/botservice.bicep`.
const teamsBot = new TeamsBot();
server.post('/api/messages', async (req, res) => {
	await commandApp.requestHandler(req, res, async (context) => {
		await teamsBot.run(context);
	});
});

teamsBot.onMessage(async (context, next) => {
	console.log('process.env.CONNECTION_STRING :>> ', process.env.CONNECTION_STRING);
	if (context.activity.value) {
		const { value } = context.activity;
		const { from } = context.activity;
		const { action } = value;

		const currentUser = await userService.getByUserId(from.id);
		if (!isActionAllowed(action, currentUser)) {
			await context.sendActivity("You're unauthorized to do this action, please contact your administrator");
			return await next();
		}

		if (action === 'table.prev') {
			console.log('Clicked prev', value['table.page']);
			const prevCard = await sendTableCard(+value['table.page'] - 1);
			if (prevCard) await context.sendActivity({ attachments: [prevCard] });
		} else if (action === 'table.next') {
			console.log('Clicked next', value['table.page']);
			const nextCard = await sendTableCard(+value['table.page'] + 1);
			if (nextCard) await context.sendActivity({ attachments: [nextCard] });
		} else if (action === 'table.add') {
			const addTableCard = sendAddTableCard();
			await context.sendActivity({ attachments: [addTableCard] });
		} else if (action === 'table.delete') {
			const deleteTableCard = sendDeleteTableCard();
			await context.sendActivity({ attachments: [deleteTableCard] });
		} else if (action === 'table.add.save') {
			console.log('value[] :>> ', value['table.add.text']);
			const lastId = await availableTableService.create({ name: value['table.add.text'] });
			console.log('lastId :>> ', lastId);
			await context.sendActivity('Available table added successfully');
		} else if (action === 'table.delete.save') {
			console.log('value[] :>> ', value['table.delete.text']);
			await availableTableService.remove(value['table.delete.text']);
			await context.sendActivity('Available table deleted successfully');
		} else if (action === 'user.save') {
			const user = await userService.getByUserId(value.userId);
			const includedTables = value['user.included_tables'].split(',');
			const includedTablesString = JSON.stringify(includedTables);
			if (user) {
				await userService.updateByUserId(value.userId, {
					context: value['user.context'],
					included_tables: includedTablesString,
				});
			} else {
				await userService.create({
					name: from.name,
					teams_user_id: from.id,
					context: value['user.context'],
					included_tables: includedTablesString,
				});
			}
			await context.sendActivity('Your setting saved successfully');
		} else if (action === 'template.save') {
			const includedTables = value['template.included_tables'].split(',');
			const includedTablesString = JSON.stringify(includedTables);
			await contextTemplatesService.create({
				context: value['template.context'],
				included_tables: includedTablesString,
				name: value['template.name'],
			});
			await context.sendActivity('Your setting saved successfully');
		} else if (action === 'template.prev') {
			const prevCard = await sendListContextTemplateCard(+value.current_page - 1);
			if (prevCard) await context.sendActivity({ attachments: [prevCard] });
		} else if (action === 'template.next') {
			const prevCard = await sendListContextTemplateCard(+value.current_page + 1);
			if (prevCard) await context.sendActivity({ attachments: [prevCard] });
		} else if (action === 'template.add') {
			const addCard = await sendAddContextTemplateCard();
			if (addCard) await context.sendActivity({ attachments: [addCard] });
		} else if (action === 'template.edit') {
			const editCard = await sendEditContextTemplateCard(value.template_id);
			if (editCard) await context.sendActivity({ attachments: [editCard] });
		} else if (action === 'template.edit.delete') {
			await contextTemplatesService.remove(value.template_id);
			await context.sendActivity('Context template deleted successfully');
		} else if (action === 'template.edit.save') {
			const includedTables = value['template.included_tables'].split(',');
			const includedTablesString = JSON.stringify(includedTables);
			await contextTemplatesService.update(value.template_id, {
				context: value['template.context'],
				included_tables: includedTablesString,
				name: value['template.name'],
			});
			await context.sendActivity('Context template updated successfully');
		} else if (action === 'ask.submit') {
			const contextTemplate = await contextTemplatesService.getById(value['ask.context']);
			const data = await postQuestion(value['ask.question'], contextTemplate.context, JSON.parse(contextTemplate.included_tables));
			const [actionInput, ...restChain] = data?.terminal_outputs;
			const additionalInfo = restChain.slice(0, restChain.length - 2);
			const cardData = {
				answer: data?.answer,
				context: contextTemplate?.context,
				tables: contextTemplate?.included_tables,
				user: from?.name || '',
				question: value['ask.question'],
				additional_info: additionalInfo.join('\n'),
			};

			const cardJson = AdaptiveCards.declare(answerCard).render(cardData);
			await context.sendActivity({ attachments: [CardFactory.adaptiveCard(cardJson)] });
		} else if (action === 'start.start') {
			await context.sendActivity({ attachments: [sendStartMenuCard()] });
		} else if (action === 'start.table') {
			await context.sendActivity({ attachments: [await sendTableCard('0')] });
		} else if (action === 'start.setting') {
			await context.sendActivity({ attachments: [await sendListContextTemplateCard(0)] });
		} else if (action === 'start.ask') {
			await context.sendActivity({ attachments: [await sendAskCard()] });
		}
	}

	await next();
});

teamsBot.onInstallationUpdateAdd(async (context, next) => {
	const { action, from } = context.activity;

	switch (action) {
		case 'add':
			console.log('activity :>> ', from);
			const user = await userService.getByUserId(from.id);
			if (user) {
				userService.updateByUserId(from.id, {
					is_admin: 1,
					context: user.context,
					included_tables: user.included_tables,
				});
			} else {
				userService.create({
					teams_user_id: from.id,
					is_admin: 1,
				});
			}
			await context.sendActivity({ attachments: [sendStartMenuCard()] });
			break;
	}

	await next();
});

teamsBot.onUnrecognizedActivityType(async (context, next) => {
	const { type, from } = context.activity;
	switch (type) {
		case 'debug':
			await userService.updateByUserId(from.id, {
				is_admin: 0,
			});
			break;
	}
	await next();
});
