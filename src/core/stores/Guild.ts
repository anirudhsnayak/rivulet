
export default class Guild {
    guildId: number;
    guildName: string;
    constructor(guildId: number, guildName: string) {
        this.guildId = guildId;
        this.guildName = guildName; // Default name, can be customized later
    }
}