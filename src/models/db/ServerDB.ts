import type { ServerRole } from "../server-hierarchy/ServerRole";

/**
 * DB-layer shape for a server record.
 *
 * **Naming note:** Uses `snake_case` fields matching the PostgreSQL schema.
 * The equivalent UI-layer model is {@link Guild | models/server-hierarchy/Guild.ts}
 * with `camelCase` fields (`guildId` / `guildName`).
 *
 * @see {@link Guild} — equivalent domain model (camelCase)
 * @see {@link docs/architecture.md#db-shapes} — DB shapes overview
 * @see {@link InMemoryDB} — stores data as this shape
 */
export interface ServerDB {
    role: ServerRole;
    /** Unique server identifier. */
    server_id: number;
    /** Display name of the server. */
    server_name: string;
}