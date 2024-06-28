const { CardFactory } = require('botbuilder');
const { AdaptiveCards } = require('@microsoft/adaptivecards-tools');
const availableTablesService = require('../service/availableTablesService');
const contextTemplatesService = require('../service/contextTemplatesService');
const { parse } = require('dotenv');

const sendAddContextTemplateCard = async () => {
	const tables = await availableTablesService.getNameList();
	const choices = tables.map((table) => ({ title: table, value: table }));

	const addContextTemplateCard = addContextTemplateJSON({ choices });

	const cardJson = AdaptiveCards.declare(addContextTemplateCard).render();
	return CardFactory.adaptiveCard(cardJson);
};

const sendListContextTemplateCard = async (page = 0) => {
	const contextTemplates = await contextTemplatesService.read(page, 5);

	const listContextTemplateCard = listContextTemplateJSON({ templates: contextTemplates, page });

	const cardJson = AdaptiveCards.declare(listContextTemplateCard).render();
	return CardFactory.adaptiveCard(cardJson);
};

const sendEditContextTemplateCard = async (id) => {
	const tables = await availableTablesService.getNameList();
	const choices = tables.map((table) => ({ title: table, value: table }));
	const contextTemplate = await contextTemplatesService.getById(id);

	const addContextTemplateCard = editContextTemplateJSON({ choices, contextTemplate });

	const cardJson = AdaptiveCards.declare(addContextTemplateCard).render();
	return CardFactory.adaptiveCard(cardJson);
};

const addContextTemplateJSON = ({ choices }) => {
	return {
		type: 'AdaptiveCard',
		$schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
		version: '1.6',
		body: [
			{
				type: 'TextBlock',
				text: 'Add Context Template',
				wrap: true,
				weight: 'Bolder',
				size: 'Medium',
			},
			{
				type: 'Input.Text',
				placeholder: 'Input your template name here...',
				label: 'Name',
				spacing: 'Medium',
				separator: true,
				id: 'template.name',
			},
			{
				type: 'Input.Text',
				placeholder: 'Enter context prompt here...',
				label: 'Context',
				isMultiline: true,
				id: 'template.context',
				value: '',
			},
			{
				type: 'Input.ChoiceSet',
				choices: choices,
				placeholder: 'Placeholder text',
				label: 'Included Tables',
				id: 'template.included_tables',
				isMultiSelect: true,
				value: '',
			},
			{
				type: 'ActionSet',
				actions: [
					{
						type: 'Action.Submit',
						title: 'Save',
						data: {
							action: 'template.save',
						},
						role: 'Button',
						id: 'template.save',
					},
				],
			},
		],
	};
};

const listContextTemplateJSON = ({ templates, page = 0 }) => {
	const headerRow = {
		type: 'TableRow',
		cells: [
			{
				type: 'TableCell',
				spacing: 'None',
				items: [
					{
						type: 'TextBlock',
						text: 'Name',
						wrap: true,
					},
				],
			},
			{
				type: 'TableCell',
				items: [
					{
						type: 'TextBlock',
						text: 'Included Tables',
						wrap: true,
					},
				],
			},
			{
				type: 'TableCell',
				items: [
					{
						type: 'TextBlock',
						text: 'Action',
						wrap: true,
					},
				],
			},
		],
	};
	const templateRows = templates.map((template) => {
		return {
			type: 'TableRow',
			cells: [
				{
					type: 'TableCell',
					spacing: 'None',
					items: [
						{
							type: 'TextBlock',
							text: template.name,
							wrap: true,
						},
					],
				},
				{
					type: 'TableCell',
					items: [
						{
							type: 'TextBlock',
							text: template.included_tables,
							wrap: true,
						},
					],
				},
				{
					type: 'TableCell',
					items: [
						{
							type: 'ActionSet',
							actions: [
								{
									type: 'Action.Submit',
									title: 'Edit/Details',
									data: {
										action: 'template.edit',
										template_id: template.id,
									},
								},
							],
						},
					],
				},
			],
		};
	});

	return {
		type: 'AdaptiveCard',
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
								size: 'Medium',
								weight: 'Bolder',
								text: 'Context Templates',
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
										title: 'Add New',
										data: {
											action: 'template.add',
										},
									},
								],
								horizontalAlignment: 'Right',
							},
						],
						horizontalAlignment: 'Right',
					},
				],
			},
			{
				type: 'Table',
				columns: [
					{
						width: 1,
					},
					{
						width: 1,
					},
					{
						width: 1,
					},
				],
				rows: [headerRow, ...templateRows],
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
											action: 'template.prev',
											current_page: `${page}`,
											prev_page: `${page - 1}`,
										},
										isEnabled: page > 0,
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
								type: 'ActionSet',
								actions: [
									{
										type: 'Action.Submit',
										title: 'Next',
										data: {
											action: 'template.next',
											current_page: `${page}`,
											next_page: `${page + 1}`,
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
		$schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
		version: '1.6',
	};
};

const editContextTemplateJSON = ({ choices, contextTemplate }) => {
	const includedTables = JSON.parse(contextTemplate.included_tables);
	const includedTablesString = includedTables.join(',');
	return {
		type: 'AdaptiveCard',
		$schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
		version: '1.6',
		body: [
			{
				type: 'TextBlock',
				text: 'Details/Edit Context Template',
				wrap: true,
				weight: 'Bolder',
				size: 'Medium',
			},
			{
				type: 'Input.Text',
				placeholder: 'Input your template name here...',
				label: 'Name',
				spacing: 'Medium',
				separator: true,
				id: 'template.name',
				value: contextTemplate.name,
			},
			{
				type: 'Input.Text',
				placeholder: 'Enter context prompt here...',
				label: 'Context',
				isMultiline: true,
				id: 'template.context',
				value: contextTemplate.context,
			},
			{
				type: 'Input.ChoiceSet',
				choices: choices,
				placeholder: 'Placeholder text',
				label: 'Included Tables',
				id: 'template.included_tables',
				isMultiSelect: true,
				value: includedTablesString,
			},
			{
				type: 'ActionSet',
				actions: [
					{
						type: 'Action.Submit',
						title: 'Save',
						data: {
							action: 'template.edit.save',
							template_id: `${contextTemplate.id}`,
						},
						role: 'Button',
						id: 'template.save',
					},
					{
						type: 'Action.Submit',
						title: 'Delete',
						data: {
							action: 'template.edit.delete',
							template_id: `${contextTemplate.id}`,
						},
					},
				],
			},
		],
	};
};

module.exports = {
	sendAddContextTemplateCard,
	sendListContextTemplateCard,
	sendEditContextTemplateCard,
};
