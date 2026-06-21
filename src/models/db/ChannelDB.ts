/**
 * DB-layer shape for a channel record.
 *
 * Uses `snake_case` fields matching the PostgreSQL schema. The equivalent
 * UI-layer model is {@link Channel | models/server-hierarchy/Channel.ts}.
 *
 * @todo Rename `name` to `channel_name` for consistency with the rest of the
 *       codebase naming conventions.
 *
 * @see {@link Channel} — equivalent domain model (camelCase)
 * @see {@link docs/architecture.md#db-shapes} — DB shapes overview
 */
export interface ChannelDB {
    /** Display name of the channel (e.g. "#general"). */
    name: string; //TODO: update the db to make this channel_name for consistency
    /** The ID of the server this channel belongs to. */
    server_id: number;
    /** Unique channel identifier. */
    channel_id: number;
}