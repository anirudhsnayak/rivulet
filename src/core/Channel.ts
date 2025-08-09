
export default class Channel {
    parentGuildId: number;
    channelId: number;
    constructor(parentGuildId: number, channelId: number) {
        this.parentGuildId = parentGuildId;
        this.channelId = channelId;
    }
}