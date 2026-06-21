/**
 * DB-layer shape for a user's data model.
 *
 * Represents all server memberships for a single user. This is the top-level
 * shape returned by the user-model API and used to hydrate the Redux store
 * with the user's guilds.
 *
 * @see {@link ServerDB} — individual server record within the array
 * @see {@link docs/architecture.md#db-shapes} — DB shapes overview
 */
import type { ServerDB } from "./ServerDB";

export interface UserModelDB {
    /** The servers this user is a member of. */
    servers: ServerDB[];
}