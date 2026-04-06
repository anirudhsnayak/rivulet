
export interface Guild {
    guildId: number;
    guildName: string;
}

//to make redux happy, we need to make a factory function that creates a new channel object instead of using the constructor directly. 
export function Guild(guildId: number, guildName: string): Guild {
    return {
        guildId,
        guildName
    };
}