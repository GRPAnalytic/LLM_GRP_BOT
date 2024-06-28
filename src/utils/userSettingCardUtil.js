const { AdaptiveCards } = require('@microsoft/adaptivecards-tools');
const availableTablesService = require('../service/availableTablesService');
const usersService = require('../service/usersService');
const { CardFactory } = require('botbuilder');

const sendUserSettingCard = async (userId, username) => {
  try {
    const tables = await availableTablesService.getNameList();
    const choices = tables.map(table => ({ title: table, value: table }));

    const user = await usersService.getByUserId(userId);
    const includedTables = user?.included_tables ? JSON.parse(user.included_tables) : [];

    const cardData = {
		user: username,
	};

    const userSettingCard = userSettingCommandJSON({
      choices,
      userIncludedTables: includedTables.join(','),
      userId,
	  context: user ? user.context : '',
    });

    const cardJson = AdaptiveCards.declare(userSettingCard).render(cardData);
	return CardFactory.adaptiveCard(cardJson);
  } catch (err) {
    console.log('err.stack :>> ', err.stack);
    return null;
  }
}

const userSettingCommandJSON = ({ choices, userIncludedTables, userId, context }) => {
	return {
		type: 'AdaptiveCard',
		$schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
		version: '1.6',
		body: [
			{
				type: 'TextBlock',
				text: '${user} Setting',
				wrap: true,
				weight: 'Bolder',
				size: 'Medium',
			},
			{
				type: 'Input.Text',
				placeholder: 'Enter context prompt here...',
				label: 'Context',
				isMultiline: true,
				spacing: 'Medium',
				separator: true,
				id: 'user.context',
				value: context
			},
			{
				type: 'Input.ChoiceSet',
				choices: choices,
				placeholder: 'Placeholder text',
				label: 'Included Tables',
				id: 'user.included_tables',
				isMultiSelect: true,
				value: userIncludedTables,
			},
			{
				type: 'ActionSet',
				actions: [
					{
						type: 'Action.Submit',
						title: 'Save',
						data: {
							action: 'user.save',
              				userId: userId,
						},
					},
				],
			},
		],
	};
};

module.exports = {
  sendUserSettingCard,
}