/**
 * @file Barrel exports for the server-hierarchy domain models.
 *
 * These models represent the Redux store / UI concept of guilds, channels,
 * messages, and members — distinct from the DB-layer shapes in
 * {@link models/db}.
 *
 * @see {@link docs/architecture.md#domain-models} — domain model overview
 */

export { Guild } from './Guild';
export { Channel } from './Channel';
export { Message } from './Message';
export { ServerMember } from './ServerMember';