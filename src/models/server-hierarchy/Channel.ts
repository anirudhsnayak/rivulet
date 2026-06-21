/**
 * Represents a text channel within a guild, used in the Redux store and UI layer.
 *
 * Channels belong to a parent guild and are identified by `parentGuildId`.
 * The list of channels visible for the selected guild is stored in
 * {@link UserState.visibleChannels}.
 *
 * @see {@link ChannelDB} — equivalent DB shape
 * @see {@link docs/architecture.md#domain-models} — domain model overview
 */
export interface Channel {
    /** The ID of the guild this channel belongs to. */
    parentGuildId: number;
    /** Unique channel identifier within the guild. */
    channelId: number;
    /** Display name of the channel (e.g. "#general"). */
    channelName: string;
}

/**
 * Factory function for creating a {@link Channel} object.
 *
 * @param parentGuildId - The ID of the guild this channel belongs to.
 * @param channelId - Unique channel identifier within the guild.
 * @param channelName - Display name of the channel.
 * @returns A plain object conforming to the {@link Channel} interface.
 */
export function Channel(parentGuildId: number, channelId: number, channelName: string): Channel {
    return {
        parentGuildId: parentGuildId,
        channelId: channelId,
        channelName: channelName
    };
}