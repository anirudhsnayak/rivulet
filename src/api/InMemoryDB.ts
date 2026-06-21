/**
 * @file In-memory database singleton — the default dev backend for Rivulet.
 *
 * Provides a full in-memory data store backed by localStorage persistence,
 * eliminating the need for a PostgreSQL server during UI development.
 * All data is reloaded from localStorage on page refresh.
 *
 * The database includes default seed data on first visit (a dev user
 * "dev"/"password", a "Rivulet HQ" server with a "#general" channel,
 * sample messages, and a valid invite code).
 *
 * Every public method includes a small artificial delay (50ms) to simulate
 * async network behaviour.
 *
 * @see {@link docs/architecture.md#in-memory-database-inmemorydb} — full DB docs
 */

import type { ChannelDB } from "../models/db/ChannelDB";
import type { MessageDB } from "../models/db/MessageDB";
import type { ServerDB } from "../models/db/ServerDB";
import type { ServerMemberDB } from "../models/db/ServerMemberDB";
import { eventBus, Events } from "./EventBus";

// ---------------------------------------------------------------------------
// Internal data shapes (widen the DB interfaces so we can track extra fields)
// ---------------------------------------------------------------------------

/** Stored user record with hashed password. */
interface StoredUser {
  id: number;
  username: string;
  hash: string;
}

/** Stored server record. */
interface StoredServer {
  server_id: number;
  server_name: string;
}

/** Stored channel record. */
interface StoredChannel {
  channel_id: number;
  server_id: number;
  name: string;
}

/** Stored message record (without resolved author name). */
interface StoredMessage {
  message_id: number;
  guild_id: number;
  channel_id: number;
  user_id: number;
  message_text: string;
}

/** Stored membership join-table record. */
interface StoredMember {
  user_id: number;
  server_id: number;
}

// ---------------------------------------------------------------------------
// Persistence schema — shape of the JSON blob stored in localStorage
// ---------------------------------------------------------------------------

/** Full snapshot of the in-memory DB serialised to a plain object. */
interface DBSnapshot {
  nextUserId: number;
  nextServerId: number;
  nextChannelId: number;
  nextMessageId: number;
  users: Record<string, StoredUser>;
  servers: Record<string, StoredServer>;
  channels: Record<string, StoredChannel>;
  messages: Record<string, StoredMessage>;
  members: Record<string, StoredMember>;
  invites: Record<string, number>;
  serverInvites: Record<string, string>;
}

const STORAGE_KEY = "rivulet_db";

/** Attempts to load a {@link DBSnapshot} from localStorage. Returns `null` if
 *  no snapshot exists or the stored data is corrupt. */
function loadSnapshot(): DBSnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DBSnapshot;
  } catch (e) {
    console.warn("Failed to load Rivulet DB from localStorage, starting fresh:", e);
    return null;
  }
}

/** Serialises and writes a {@link DBSnapshot} to localStorage. */
function saveSnapshot(snapshot: DBSnapshot): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch (e) {
    console.warn("Failed to persist Rivulet DB to localStorage:", e);
  }
}

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

/**
 * In-memory database singleton — the default dev backend.
 *
 * Wraps all data in private `Map` instances and exposes async methods that
 * mirror the PostgreSQL API shape. The full state is persisted to localStorage
 * after every write and restored on construction.
 */
class InMemoryDB {
  // -- counters ------------------------------------------------------------
  private nextUserId = 1;
  private nextServerId = 1;
  private nextChannelId = 1;
  private nextMessageId = 1;

  // -- stores --------------------------------------------------------------
  private users: Map<number, StoredUser> = new Map();
  private servers: Map<number, StoredServer> = new Map();
  private channels: Map<number, StoredChannel> = new Map();
  private messages: Map<number, StoredMessage> = new Map();
  /** composite key "userId-serverId" → membership */
  private members: Map<string, StoredMember> = new Map();
  /** invite code → server_id */
  private invites: Map<string, number> = new Map();
  /** server_id → invite code */
  private serverInvites: Map<number, string> = new Map();

  /** Generate a unique 8-character invite code (no collision check). */
  private _generateInviteCode(): string {
    let code: string;
    do {
      code = Math.random().toString(36).substring(2, 10);
    } while (this.invites.has(code));
    return code;
  }

  // -- session -------------------------------------------------------------
  private currentUserId: number | null = null;
  /** Set to true after `_ensureSeeded()` completes (async crypto). */
  private seeded = false;

  // ------------------------------------------------------------------------
  // Constructor – try to restore from localStorage; seed defaults if empty.
  // ------------------------------------------------------------------------

  constructor() {
    const saved = loadSnapshot();
    if (saved) {
      this._restore(saved);
    } else {
      this._seedDefaults();
    }
    this._persist();
  }

  /** Hydrate all Maps from a persisted {@link DBSnapshot}. */
  private _restore(snapshot: DBSnapshot): void {
    this.nextUserId = snapshot.nextUserId;
    this.nextServerId = snapshot.nextServerId;
    this.nextChannelId = snapshot.nextChannelId;
    this.nextMessageId = snapshot.nextMessageId;

    this.users = new Map(
      Object.entries(snapshot.users).map(([k, v]) => [Number(k), v]),
    );
    this.servers = new Map(
      Object.entries(snapshot.servers).map(([k, v]) => [Number(k), v]),
    );
    this.channels = new Map(
      Object.entries(snapshot.channels).map(([k, v]) => [Number(k), v]),
    );
    this.messages = new Map(
      Object.entries(snapshot.messages).map(([k, v]) => [Number(k), v]),
    );
    this.members = new Map(Object.entries(snapshot.members));
    this.invites = new Map(Object.entries(snapshot.invites));
    this.serverInvites = new Map(
      Object.entries(snapshot.serverInvites).map(([k, v]) => [Number(k), v]),
    );
  }

  /** Serialize all Maps into a plain-object {@link DBSnapshot} for localStorage. */
  private _snapshot(): DBSnapshot {
    return {
      nextUserId: this.nextUserId,
      nextServerId: this.nextServerId,
      nextChannelId: this.nextChannelId,
      nextMessageId: this.nextMessageId,
      users: Object.fromEntries(this.users),
      servers: Object.fromEntries(this.servers),
      channels: Object.fromEntries(this.channels),
      messages: Object.fromEntries(this.messages),
      members: Object.fromEntries(this.members),
      invites: Object.fromEntries(this.invites),
      serverInvites: Object.fromEntries(this.serverInvites),
    };
  }

  /** Write the current state to localStorage. */
  private _persist(): void {
    saveSnapshot(this._snapshot());
  }

  /** Seed initial data when localStorage is empty (first visit). */
  private _seedDefaults(): void {
    // Default server
    this.servers.set(1, { server_id: 1, server_name: "Rivulet HQ" });
    this.nextServerId = 2;

    // Default channel
    this.channels.set(1, { channel_id: 1, server_id: 1, name: "general" });
    this.nextChannelId = 2;

    // Dev user (id 1) is a member of Rivulet HQ
    this.members.set("1-1", { user_id: 1, server_id: 1 });

    // Default invite for Rivulet HQ
    const defaultInvite = this._generateInviteCode();
    this.invites.set(defaultInvite, 1);
    this.serverInvites.set(1, defaultInvite);

    // A few sample messages
    this.messages.set(1, {
      message_id: 1,
      guild_id: 1,
      channel_id: 1,
      user_id: 1,
      message_text: "Welcome to Rivulet HQ! 🎉",
    });
    this.messages.set(2, {
      message_id: 2,
      guild_id: 1,
      channel_id: 1,
      user_id: 1,
      message_text: "Data now persists across reloads via localStorage — no PostgreSQL required.",
    });
    this.messages.set(3, {
      message_id: 3,
      guild_id: 1,
      channel_id: 1,
      user_id: 1,
      message_text: "Flip API_MODE to 'psql' in src/api/ApiConfig.ts to switch back.",
    });
    this.nextMessageId = 4;
  }

  // -- helpers -------------------------------------------------------------

  /** Builds the composite key for the members map. */
  private _memberKey(userId: number, serverId: number): string {
    return `${userId}-${serverId}`;
  }

  /** Tiny artificial delay so calls still feel async (default 50ms). */
  private _delay = (ms = 50) => new Promise((r) => setTimeout(r, ms));

  /** Asserts the user is authenticated and returns their user ID. */
  private _requireAuth(): number {
    if (this.currentUserId === null) {
      throw new Error("Not authenticated — login first.");
    }
    return this.currentUserId;
  }

  /**
   * Mirrors {@link LoginController.computeHash} so the seeded user's stored
   * hash matches what the client sends.
   */
  private async _computeHash(username: string, password: string): Promise<string> {
    const saltedPassword = username + password;
    const hashedPassword = await window.crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(saltedPassword),
    );
    const hashArray = Array.from(new Uint8Array(hashedPassword));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  /** Lazily create the dev user (`dev` / `password`) with a properly-hashed password. */
  private async _ensureSeeded(): Promise<void> {
    if (this.seeded) return;
    this.seeded = true;
    // Only create dev user if not already persisted from a previous session
    if (!this.users.has(1)) {
      const hash = await this._computeHash("dev", "password");
      this.users.set(1, { id: 1, username: "dev", hash });
      if (this.nextUserId < 2) this.nextUserId = 2;
      this._persist();
    }
  }

  // ------------------------------------------------------------------------
  // Account
  // ------------------------------------------------------------------------

  /** Clears the current session — called on logout. Does not erase stored data. */
  clearSession(): void {
    this.currentUserId = null;
  }

  /**
   * Authenticates a user by username and SHA-256 hash.
   * Lazily seeds the dev user on first call.
   */
  async login(username: string, hash: string): Promise<boolean> {
    await this._ensureSeeded();
    await this._delay();
    for (const u of this.users.values()) {
      if (u.username === username && u.hash === hash) {
        this.currentUserId = u.id;
        return true;
      }
    }
    return false;
  }

  /**
   * Registers a new user with the given username and SHA-256 hash.
   * Rejects duplicate usernames.
   */
  async signup(username: string, hash: string): Promise<boolean> {
    await this._ensureSeeded();
    await this._delay();
    // Reject duplicate usernames
    for (const u of this.users.values()) {
      if (u.username === username) return false;
    }
    const id = this.nextUserId++;
    this.users.set(id, { id, username, hash });
    this._persist();
    this.currentUserId = id;
    return true;
  }

  // ------------------------------------------------------------------------
  // User model
  // ------------------------------------------------------------------------

  /** Returns the list of servers the current user belongs to. */
  async getUserModel(): Promise<{ servers: ServerDB[] }> {
    await this._delay();
    const userId = this._requireAuth();
    const servers: ServerDB[] = [];
    for (const m of this.members.values()) {
      if (m.user_id === userId) {
        const s = this.servers.get(m.server_id);
        if (s) servers.push({ server_id: s.server_id, server_name: s.server_name });
      }
    }
    return { servers };
  }

  // ------------------------------------------------------------------------
  // Server
  // ------------------------------------------------------------------------

  /**
   * Creates a new server with the given name.
   *
   * The creator is automatically added as a member, an invite code is
   * generated, and a `#general` channel is created.
   *
   * @returns An object containing the new server's ID.
   */
  async createServer(serverName: string): Promise<{ created_server_id: number }> {
    await this._delay();
    const userId = this._requireAuth();
    const serverId = this.nextServerId++;
    this.servers.set(serverId, { server_id: serverId, server_name: serverName });
    // Creator automatically becomes a member
    this.members.set(this._memberKey(userId, serverId), {
      user_id: userId,
      server_id: serverId,
    });
    // Generate a unique invite code for this server
    const inviteCode = this._generateInviteCode();
    this.invites.set(inviteCode, serverId);
    this.serverInvites.set(serverId, inviteCode);

    // Automatically create a #general channel in the new server
    const channelId = this.nextChannelId++;
    this.channels.set(channelId, {
      channel_id: channelId,
      server_id: serverId,
      name: 'general',
    });
    this._persist();
    return { created_server_id: serverId };
  }

  /**
   * Retrieves the invite code for a server. Generates one if it doesn't exist yet.
   */
  async getInviteCode(serverId: number): Promise<{ invite_code: string }> {
    await this._delay();
    this._requireAuth();
    const existingCode = this.serverInvites.get(serverId);
    if (existingCode) return { invite_code: existingCode };
    // If no code exists yet (shouldn't happen for servers created normally),
    // generate one now:
    const code = this._generateInviteCode();
    this.invites.set(code, serverId);
    this.serverInvites.set(serverId, code);
    this._persist();
    return { invite_code: code };
  }

  /**
   * Joins a server using an invite code. No-op if already a member.
   *
   * @returns `true` if the user joined (or already belonged), `false` if the
   *          invite code is invalid.
   */
  async joinServer(inviteCode: string): Promise<boolean> {
    await this._delay();
    const userId = this._requireAuth();
    const serverId = this.invites.get(inviteCode);
    if (serverId === undefined) return false;
    // Don't double-add
    if (this.members.has(this._memberKey(userId, serverId))) return true;
    this.members.set(this._memberKey(userId, serverId), {
      user_id: userId,
      server_id: serverId,
    });
    this._persist();
    return true;
  }

  /** Removes the current user's membership from a server. */
  async leaveServer(serverId: number): Promise<void> {
    await this._delay();
    const userId = this._requireAuth();
    this.members.delete(this._memberKey(userId, serverId));
    this._persist();
  }

  // ------------------------------------------------------------------------
  // Channel
  // ------------------------------------------------------------------------

  /** Creates a new channel in the given server. */
  async createChannel(serverId: number, channelName: string): Promise<ChannelDB> {
    await this._delay();
    this._requireAuth();
    const channelId = this.nextChannelId++;
    const channel: StoredChannel = {
      channel_id: channelId,
      server_id: serverId,
      name: channelName,
    };
    this.channels.set(channelId, channel);
    this._persist();
    return { channel_id: channel.channel_id, server_id: channel.server_id, name: channel.name };
  }

  /** Returns all channels in a given server. */
  async getChannels(serverId: number): Promise<{ channels: ChannelDB[] }> {
    await this._delay();
    this._requireAuth();
    const channels: ChannelDB[] = [];
    for (const c of this.channels.values()) {
      if (c.server_id === serverId) {
        channels.push({ channel_id: c.channel_id, server_id: c.server_id, name: c.name });
      }
    }
    return { channels };
  }

  // ------------------------------------------------------------------------
  // Members
  // ------------------------------------------------------------------------

  /** Returns all members of a given server, resolving usernames from user records. */
  async getMembers(serverId: number): Promise<{ members: ServerMemberDB[] }> {
    await this._delay();
    this._requireAuth();
    const members: ServerMemberDB[] = [];
    for (const m of this.members.values()) {
      if (m.server_id === serverId) {
        const user = this.users.get(m.user_id);
        const username = user ? user.username : `user-${m.user_id}`;
        members.push({ user_id: m.user_id, server_id: m.server_id, username });
      }
    }
    return { members };
  }

  // ------------------------------------------------------------------------
  // Messages
  // ------------------------------------------------------------------------

  /**
   * Stores a new message and emits a {@link Events.MessageCreated} event
   * for real-time streaming.
   */
  async createMessage(
    serverId: number,
    channelId: number,
    messageText: string,
  ): Promise<MessageDB> {
    await this._delay();
    const userId = this._requireAuth();
    const user = this.users.get(userId);
    const authorName = user ? user.username : `user-${userId}`;
    const messageId = this.nextMessageId++;
    const msg: StoredMessage = {
      message_id: messageId,
      guild_id: serverId,
      channel_id: channelId,
      user_id: userId,
      message_text: messageText,
    };
    this.messages.set(messageId, msg);
    this._persist();
    eventBus.emit(Events.MessageCreated, {
      guild_id: msg.guild_id,
      channel_id: msg.channel_id,
      user_id: msg.user_id,
      message_id: msg.message_id,
      message_text: msg.message_text,
      author_name: authorName,
    });
    return {
      guild_id: msg.guild_id,
      channel_id: msg.channel_id,
      user_id: msg.user_id,
      message_id: msg.message_id,
      message_text: msg.message_text,
      author_name: authorName,
    };
  }

  /** Returns all messages in a given channel, resolving author names. */
  async getMessages(
    serverId: number,
    channelId: number,
  ): Promise<{ messages: MessageDB[] }> {
    await this._delay();
    this._requireAuth();
    const messages: MessageDB[] = [];
    for (const m of this.messages.values()) {
      if (m.guild_id === serverId && m.channel_id === channelId) {
        const user = this.users.get(m.user_id);
        const authorName = user ? user.username : `user-${m.user_id}`;
        messages.push({
          guild_id: m.guild_id,
          channel_id: m.channel_id,
          user_id: m.user_id,
          message_id: m.message_id,
          message_text: m.message_text,
          author_name: authorName,
        });
      }
    }
    return { messages };
  }
}

// ---------------------------------------------------------------------------
// Export singleton instance
// ---------------------------------------------------------------------------

/** Singleton in-memory database instance. */
export const inMemoryDB = new InMemoryDB();

// ---------------------------------------------------------------------------
// Clear all persisted data from localStorage (auth + db)
// ---------------------------------------------------------------------------

const STORAGE_USERNAME_KEY = 'rivulet_username';
const STORAGE_HASH_KEY = 'rivulet_hash';

/** Clears all persisted data from localStorage — both auth keys and the DB snapshot. */
export function clearPersistence(): void {
    localStorage.removeItem(STORAGE_USERNAME_KEY);
    localStorage.removeItem(STORAGE_HASH_KEY);
    localStorage.removeItem(STORAGE_KEY);
}
