const { AdaptiveCards } = require('@microsoft/adaptivecards-tools');
const { CardFactory, MessageFactory } = require('botbuilder');

const answerCard = require('../adaptiveCards/answerCard.json');
const { postQuestion } = require('../service/grpLangchainService');
const usersService = require('../service/usersService');
const { sendAskCard } = require('../utils/askCardUtil');

class AskCommandHandler {
	triggerPatterns = '/ask';

	// async handleCommandReceived(context, message) {
	// 	const { from } = context.activity;
	// 	// verify the command arguments which are received from the client if needed.
	// 	console.log(`App received message: ${message.text}`);
	// 	const question = message.text.replace('/ask ', '');

	// 	const user = await usersService.getByUserId(from.id);
	// 	const includedTables = JSON.parse(user?.included_tables);
	// 	const data = await postQuestion(question, user?.context, includedTables);


	// 	const cardData = {
	// 		answer: data?.answer,
	// 		context: user?.context,
	// 		tables: user?.included_tables,
	// 		user: from.name,
	// 		question,
	// 	};

	// 	const cardJson = AdaptiveCards.declare(answerCard).render(cardData);
	// 	return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
	// }

	async handleCommandReceived(context, message) {
		return MessageFactory.attachment(await sendAskCard(0));
	}
}

module.exports = {
	AskCommandHandler,
};
