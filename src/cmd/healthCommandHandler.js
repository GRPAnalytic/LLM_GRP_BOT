const { AdaptiveCards } = require('@microsoft/adaptivecards-tools');
const { MessageFactory, CardFactory } = require('botbuilder');
const { sendTableCard } = require('../utils/tableCardUtil');
const { health } = require('../database/sequelize');

class HealthCommandHandler {
	triggerPatterns = '/health';

	async handleCommandReceived(context, message) {
		return MessageFactory.text(await health());
	}
}

module.exports = {
	HealthCommandHandler,
};
