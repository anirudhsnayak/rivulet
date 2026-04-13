
export interface Guild {
    guildId: number;
    guildName: string;
}

export function Guild(guildId: number, guildName: string): Guild {
    return {
        guildId,
        guildName
    };
}