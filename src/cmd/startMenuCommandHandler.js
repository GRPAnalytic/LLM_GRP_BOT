const { MessageFactory } = require("botbuilder");
const { sendStartMenuCard } = require("../utils/startMenuUtil");

class StartMenuCommandHandler {
    triggerPatterns = '/start';

    async handleCommandReceived(context, message) {
		return MessageFactory.attachment(sendStartMenuCard());
	}
}

module.exports = {
    StartMenuCommandHandler,
}