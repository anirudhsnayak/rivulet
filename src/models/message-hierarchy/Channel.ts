
export interface Channel {
    parentGuildId: number;
    channelId: number;
    channelName: string;
}

export function Channel(parentGuildId: number, channelId: number, channelName: string): Channel {
    return {
        parentGuildId: parentGuildId,
        channelId: channelId,
        channelName: channelName
    };
}