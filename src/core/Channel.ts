
export default class Channel {
    parentGuildId: number;
    channelId: number;
    channelName: string;
    constructor(parentGuildId: number, channelId: number) {
        this.parentGuildId = parentGuildId;
        this.channelId = channelId;
        this.channelName = `Channel ${channelId}`; // Default name based on ID
    }
}