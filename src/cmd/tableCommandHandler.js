const { AdaptiveCards } = require('@microsoft/adaptivecards-tools');
const { MessageFactory, CardFactory } = require('botbuilder');
const { sendTableCard } = require('../utils/tableCardUtil');

class TableCommandHandler {
	triggerPatterns = '/table';

	async handleCommandReceived(context, message) {
		return MessageFactory.attachment(await sendTableCard('0'));
	}
}

module.exports = {
	TableCommandHandler,
};
