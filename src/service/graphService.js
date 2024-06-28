const { ConfidentialClientApplication, PublicClientApplication } = require('@azure/msal-node');
const fetch = require('node-fetch');

const config = {
	auth: {
		clientId: process.env.MICROSOFT_APP_ID,
		authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}`,
		// clientSecret: process.env.MICROSOFT_APP_PASSWORD,
	},
};

// const cca = new ConfidentialClientApplication(config);
const pca = new PublicClientApplication(config);

const getAccessToken = async (context) => {
	// const result = await cca.acquireTokenOnBehalfOf({
	// 	authority: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}`,
	// 	scopes: [
	// 		'https://graph.microsoft.com/User.ReadBasic.All',
	// 		'https://graph.microsoft.com/TeamMember.Read.All',
	// 	],
	// 	skipCache: true,
	// 	oboAssertion: context.activity.from.token,
	// });

	// const result = await cca.acquireTokenByClientCredential({
	// 	scopes: [
	// 		"https://graph.microsoft.com/.default",
	// 		// 'https://graph.microsoft.com/User.ReadBasic.All',
	// 		// 'https://graph.microsoft.com/TeamMember.Read.All',
	// 	],
	// })

	// return result.accessToken;

	// const { channelId } = context.activity;
	// const userId = context.activity.from.id;
	// const userTokenClient = context.turnState.get(context.adapter.UserTokenClientKey);
	// const tokenResponse = await userTokenClient.getUserToken(userId, process.env.ConnectionName, channelId);
	// return tokenResponse.token;

	const result = await pca.acquireTokenByDeviceCode({
		scopes: [
			'User.Read', 
			'User.ReadBasic.All',
			'TeamMember.Read.All'
		],
		deviceCodeCallback: async (req) => {
			await context.sendActivity(req.message);
		},

	});
    return result.accessToken;
};

const isUserAdmin = async (context) => {
	const { from } = context.activity;
	const { conversation } = context.activity;

	const userId = from.aaUserId;
	const [teamId] = conversation.id.split(';');
	const token = await getAccessToken(context);

	const res = await fetch(`https://graph.microsoft.com/v1.0/teams/${teamId}/members/${userId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		method: 'GET',
	});

	const data = await res.json();

	return data;
};

module.exports = {
	getAccessToken,
	isUserAdmin,
};
