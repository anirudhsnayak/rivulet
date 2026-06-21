/**
 * Represents a server ("guild") in the Redux store and UI layer.
 *
 * **Naming note:** The codebase uses "Guild" in domain models / Redux state
 * and "Server" in the DB / API layer interchangeably for the same concept.
 * See {@link ServerDB | models/db/ServerDB.ts} for the DB shape equivalent.
 *
 * @see {@link UserState.guilds} — Redux state field holding the user's guilds
 * @see {@link ServerDB} — equivalent DB shape (`server_id` / `server_name`)
 * @see {@link docs/architecture.md#domain-models} — domain model overview
 */
export interface Guild {
    /** Unique server identifier. */
    guildId: number;
    /** Display name of the server. */
    guildName: string;
}

/**
 * Factory function for creating a {@link Guild} object.
 *
 * @param guildId - Unique server identifier.
 * @param guildName - Display name of the server.
 * @returns A plain object conforming to the {@link Guild} interface.
 */
export function Guild(guildId: number, guildName: string): Guild {
    return {
        guildId,
        guildName
    };
}