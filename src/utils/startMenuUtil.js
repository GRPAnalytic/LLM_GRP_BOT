const { AdaptiveCards } = require('@microsoft/adaptivecards-tools');
const startMenuCard = require('../adaptiveCards/startMenuCommand.json');
const { CardFactory } = require('botbuilder');

const sendStartMenuCard = () => {
    const cardJson = AdaptiveCards.declare(startMenuCard).render();
    return CardFactory.adaptiveCard(cardJson);
}

module.exports = {
    sendStartMenuCard,
}