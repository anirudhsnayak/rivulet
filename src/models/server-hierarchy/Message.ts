/**
 * Represents a chat message in the Redux store and UI layer.
 *
 * Messages are scoped to a guild + channel pair and are rendered in
 * the {@link MessageList | MessageList component}. The visible set is
 * stored in {@link UserState.visibleMessages}.
 *
 * @see {@link MessageDB} — equivalent DB shape
 * @see {@link docs/architecture.md#domain-models} — domain model overview
 */
export interface Message {
    /** The guild this message belongs to. */
    guildId: number;
    /** The channel this message belongs to. */
    channelId: number;
    /** Unique message identifier. */
    messageId: number;
    /** The text content of the message. */
    messageText: string;
    /** Display name of the message author. */
    senderName: string;
}

/**
 * Factory function for creating a {@link Message} object.
 *
 * @param guildId - The guild this message belongs to.
 * @param channelId - The channel this message belongs to.
 * @param messageId - Unique message identifier.
 * @param messageText - The text content of the message.
 * @param senderName - Display name of the message author.
 * @returns A plain object conforming to the {@link Message} interface.
 */
export function Message(guildId: number, channelId: number, messageId: number, messageText: string, senderName: string): Message {
    return {
        guildId,
        channelId,
        messageId,
        messageText,
        senderName,
    }
}