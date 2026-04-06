
export interface Channel {
    parentGuildId: number;
    channelId: number;
    channelName: string;
}

//to make redux happy, we need to make a factory function that creates a new channel object instead of using the constructor directly. 
export function Channel(parentGuildId: number, channelId: number): Channel {
    return {
        parentGuildId,
        channelId,
        channelName: `Channel ${channelId}`
    };
}