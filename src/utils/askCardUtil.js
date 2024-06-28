const { AdaptiveCards } = require('@microsoft/adaptivecards-tools');
const contextTemplatesService = require('../service/contextTemplatesService');
const { CardFactory } = require('botbuilder');

const sendAskCard = async () => {
	const contextTemplates = await contextTemplatesService.all();

	const askCard = askCardJSON({ contextTemplates });
    const cardJson = AdaptiveCards.declare(askCard).render();
	return CardFactory.adaptiveCard(cardJson);
};

const askCardJSON = ({ contextTemplates = [] }) => {
	const choices = contextTemplates.map((template) => ({
		title: template.name,
		value: `${template.id}`,
	}));
	return {
		type: 'AdaptiveCard',
		body: [
			{
				type: 'TextBlock',
				size: 'Medium',
				weight: 'Bolder',
				text: 'Ask a question',
			},
			{
				type: 'Input.Text',
				placeholder: 'Type your question here...',
				label: 'Question',
				id: 'ask.question',
				isMultiline: true,
				isRequired: true,
				errorMessage: 'Please input question properly',
				separator: true,
				spacing: 'Medium',
			},
			{
				type: 'Input.ChoiceSet',
				choices: choices,
				placeholder: 'Choose directorate',
				label: 'Directorate',
				id: 'ask.context',
				isRequired: true,
				errorMessage: 'Please choose directorate',
			},
			{
				type: 'ActionSet',
				actions: [
					{
						type: 'Action.Submit',
						title: 'Submit',
						data: {
							action: 'ask.submit',
						},
					},
				],
			},
		],
		$schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
		version: '1.5',
	};
};

module.exports = {
    sendAskCard,
}