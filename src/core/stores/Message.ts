
export interface Message {
    guildId: number;
    channelId: number;
    messageId: number;
    messageText: string;
}

export function Message(guildId: number, channelId: number, messageId: number, messageText: string): Message {
    return {
        guildId,
        channelId,
        messageId,
        messageText
    }
}