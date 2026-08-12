/**
 * Redux state slice representing the user's server data.
 *
 * Holds the guilds (servers) the user belongs to, the currently selected
 * guild/channel, and the visible data for the current viewport
 * (channels, messages, members).
 *
 * All fields use `-1` or `[]` as initial / empty sentinel values.
 *
 * @see {@link UserSlice} — Redux slice that manages this state
 * @see {@link Guild} — guild domain model
 * @see {@link Channel} — channel domain model
 * @see {@link Message} — message domain model
 * @see {@link ServerMember} — server member domain model
 * @see {@link docs/architecture.md#userslice-userstate} — architecture docs
 */
import { Guild, Channel, Message, ServerMember } from '../server-hierarchy';

export interface UserState {
  /** All guilds (servers) the currently logged-in user belongs to. */
  guilds: Guild[];
  /** ID of the currently selected guild, or `-1` if none. */
  currentGuildId: number;
  /** ID of the currently selected channel, or `-1` if none. */
  currentChannelId: number;
  /** Channels in the currently selected guild. */
  visibleChannels: Channel[];
  /** Messages in the currently selected channel. */
  visibleMessages: Message[];
  /** Members of the currently selected guild. */
  visibleMembers: ServerMember[];
  /** Online user IDs by server; absent while presence is unavailable. */
  presenceByServer: Record<number, number[]>;
}
