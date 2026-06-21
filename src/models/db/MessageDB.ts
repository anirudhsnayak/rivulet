/**
 * DB-layer shape for a message record.
 *
 * Uses `snake_case` fields matching the PostgreSQL schema. The equivalent
 * UI-layer model is {@link Message | models/server-hierarchy/Message.ts}.
 *
 * @todo Rename `user_id` to `author_id` for consistency with the Discord API
 *       and to avoid confusion with the system-level user ID stored elsewhere.
 *
 * @see {@link Message} — equivalent domain model (camelCase)
 * @see {@link docs/architecture.md#db-shapes} — DB shapes overview
 */
export interface MessageDB {
    /** The guild this message belongs to. */
    guild_id: number;
    /** The channel this message belongs to. */
    channel_id: number;
    /** ID of the user who sent the message. */
    user_id: number; //relabel this to author_id for consistency with discord api and to avoid confusion with the user_id field in the UserModel which is the id of the user in our system and not their discord id
    /** Unique message identifier. */
    message_id: number;
    /** The text content of the message. */
    message_text: string;
    /** Display name of the message author. */
    author_name: string;
}