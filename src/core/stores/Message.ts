
export default class Guild {
    guildId: number;
    channelId: number;
    messageId: number;
    messageText: string;
    constructor(guildId: number, channelId: number, messageId: number, messageText: string) {
        this.guildId = guildId;
        this.channelId = channelId;
        this.messageId = messageId;
        this.messageText = messageText;
    }
}