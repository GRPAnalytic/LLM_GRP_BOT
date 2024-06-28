const GRPCard = require("./adaptiveCards/grpCommand.json");
const { AdaptiveCards } = require("@microsoft/adaptivecards-tools");
const { CardFactory, MessageFactory } = require("botbuilder");
const { postQuestion } = require('./service/grpLangchainService')

class GRPCommandHandler {
  triggerPatterns = "grp";

  async handleCommandReceived(context, message) {
    // verify the command arguments which are received from the client if needed.
    console.log(`App received message: ${message.text}`);
    const question = message.text.replace("grp ", "");

    const data = await postQuestion(question, "", []);

    const cardData = {
      title: `Answer on question ${question}`,
      body: data?.answer,
    };

    const cardJson = AdaptiveCards.declare(GRPCard).render(cardData);
    return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
  }
}

module.exports = {
  GRPCommandHandler,
};