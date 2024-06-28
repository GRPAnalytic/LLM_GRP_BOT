const { MessageFactory } = require("botbuilder");
const { sendAddContextTemplateCard, sendListContextTemplateCard } = require("../utils/contextTemplateCardUtil");

class AddContextTemplateCommandHandler {
    triggerPatterns = '/setting';

    async handleCommandReceived(context, message) {
        return MessageFactory.attachment(await sendListContextTemplateCard(0));
    }
}

module.exports = {
    AddContextTemplateCommandHandler,
}