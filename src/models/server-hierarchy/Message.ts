
export interface Message {
    guildId: number;
    channelId: number;
    messageId: number;
    messageText: string;
    senderName: string;
}

export function Message(guildId: number, channelId: number, messageId: number, messageText: string, senderName: string): Message {
    return {
        guildId,
        channelId,
        messageId,
        messageText,
        senderName,
    }
}