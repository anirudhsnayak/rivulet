/**
 * DB-layer shape for a server membership record (join table).
 *
 * Represents the link between a user and a server they belong to.
 * Uses `snake_case` fields matching the PostgreSQL schema. The equivalent
 * UI-layer model is {@link ServerMember | models/server-hierarchy/ServerMember.ts}.
 *
 * @see {@link ServerMember} — equivalent domain model (camelCase)
 * @see {@link docs/architecture.md#db-shapes} — DB shapes overview
 */
export interface ServerMemberDB {
    /** ID of the user who is a member. */
    user_id: number;
    /** ID of the server they belong to. */
    server_id: number;
    /** Display name of the member in this server. */
    username: string;
}