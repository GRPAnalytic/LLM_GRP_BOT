const { AdaptiveCards } = require('@microsoft/adaptivecards-tools');
const { MessageFactory, CardFactory } = require('botbuilder');

const addTableCard = require('../adaptiveCards/addTableCard.json');
const deleteTableCard = require('../adaptiveCards/deleteTableCard.json');
const availableTablesService = require('../service/availableTablesService');

const sendTableCard = async (page = '0') => {
	try {
		const tables = await availableTablesService.read(+page, 5);
		console.log('tables :>> ', tables);

		const cardData = {
			tables: tables.reduce(
				(tableString, table) => `${tableString}\n${table.id}. ${table.name}`,
				'',
			),
			page: String(page),
		};
		const tableCard = tableCommandJSON(cardData);

		const cardJson = AdaptiveCards.declare(tableCard).render(cardData);
		return CardFactory.adaptiveCard(cardJson);
	} catch (err) {
		console.log('err :>> ', err.stack);
		return null;
	}
};

const sendAddTableCard = () => {
	const cardJson = AdaptiveCards.declare(addTableCard).render();
	return CardFactory.adaptiveCard(cardJson);
};

const sendDeleteTableCard = () => {
	const cardJson = AdaptiveCards.declare(deleteTableCard).render();
	return CardFactory.adaptiveCard(cardJson);
};

const tableCommandJSON = ({ tables, page }) => {
	return {
		type: 'AdaptiveCard',
		$schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
		version: '1.6',
		body: [
			{
				type: 'ColumnSet',
				columns: [
					{
						type: 'Column',
						width: 'stretch',
						items: [
							{
								type: 'TextBlock',
								text: 'Available Tables',
								wrap: true,
								style: 'heading',
								weight: 'Bolder',
								color: 'Accent',
								isSubtle: true,
							},
						],
					},
					{
						type: 'Column',
						width: 'auto',
						items: [
							{
								type: 'ColumnSet',
								columns: [
									{
										type: 'Column',
										width: 'auto',
										items: [
											{
												type: 'ActionSet',
												actions: [
													{
														type: 'Action.Submit',
														title: 'Add',
														data: {
															action: 'table.add',
														},
													},
												],
												horizontalAlignment: 'Right',
											},
										],
									},
									{
										type: 'Column',
										width: 'auto',
										items: [
											{
												type: 'ActionSet',
												actions: [
													{
														type: 'Action.Submit',
														title: 'Delete',
														data: {
															action: 'table.delete',
														},
													},
												],
												horizontalAlignment: 'Right',
											},
										],
									},
								],
							},
						],
					},
				],
			},
			{
				type: 'RichTextBlock',
				inlines: [
					{
						type: 'TextRun',
						text: tables,
					},
				],
			},
			{
				type: 'ColumnSet',
				columns: [
					{
						type: 'Column',
						width: 'stretch',
						items: [
							{
								type: 'ActionSet',
								actions: [
									{
										type: 'Action.Submit',
										title: 'Previous',
										data: {
											action: 'table.prev',
										},
									},
								],
							},
						],
					},
					{
						type: 'Column',
						width: 'stretch',
						items: [
							{
								id: 'table.page',
								type: 'Input.Text',
								placeholder: page,
								value: page,
								isVisible: false,
							},
						],
					},
					{
						type: 'Column',
						width: 'stretch',
						items: [
							{
								type: 'ActionSet',
								actions: [
									{
										type: 'Action.Submit',
										title: 'Next',
										data: {
											action: 'table.next',
										},
									},
								],
								horizontalAlignment: 'Right',
							},
						],
					},
				],
			},
		],
	};
};

module.exports = {
	sendTableCard,
	sendAddTableCard,
	sendDeleteTableCard,
};
