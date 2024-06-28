const { HelloWorldCommandHandler } = require("../helloworldCommandHandler");
const { AddContextTemplateCommandHandler } = require("./addContextTemplateHandler");
const { AskCommandHandler } = require("./askCommandHandler");
const { HealthCommandHandler } = require("./healthCommandHandler");
const { StartMenuCommandHandler } = require("./startMenuCommandHandler");
const { TableCommandHandler } = require("./tableCommandHandler");
const { UserSettingCommandHandler } = require("./userSettingCommandHandler");

module.exports = [
    new TableCommandHandler(),
    new UserSettingCommandHandler(),
    new AskCommandHandler(),
    new AddContextTemplateCommandHandler(),
    new HealthCommandHandler(),
    new StartMenuCommandHandler(),
]