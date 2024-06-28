const { MessageFactory } = require("botbuilder");
const { sendUserSettingCard } = require("../utils/userSettingCardUtil");

class UserSettingCommandHandler {
  triggerPatterns = '/my-setting';

  async handleCommandReceived(context, message) {
    const { id, name } = context.activity.from;
    
    return MessageFactory.attachment(await sendUserSettingCard(id, name));
  }
}

module.exports = {
  UserSettingCommandHandler,
}