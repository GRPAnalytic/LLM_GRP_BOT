const { BotBuilderCloudAdapter } = require("@microsoft/teamsfx");
const ConversationBot = BotBuilderCloudAdapter.ConversationBot;
const { HelloWorldCommandHandler } = require("../helloworldCommandHandler");
const config = require("./config");
const { GRPCommandHandler } = require("../grpCommandHandler");
const { TableCommandHandler } = require("../cmd/tableCommandHandler");
const cmd = require("../cmd");

// Create the command bot and register the command handlers for your app.
// You can also use the commandApp.command.registerCommands to register other commands
// if you don't want to register all of them in the constructor
const commandApp = new ConversationBot({
  // The bot id and password to create CloudAdapter.
  // See https://aka.ms/about-bot-adapter to learn more about adapters.
  adapterConfig: {
    MicrosoftAppId: config.botId,
    MicrosoftAppPassword: config.botPassword,
    MicrosoftAppType: "MultiTenant",
  },
  command: {
    enabled: true,
    commands: cmd,
  },
});

module.exports = {
  commandApp,
};
