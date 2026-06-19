import type { ChannelDB } from "../models/db/ChannelDB";
import type { MessageDB } from "../models/db/MessageDB";
import type { ServerDB } from "../models/db/ServerDB";
import type { ServerMemberDB } from "../models/db/ServerMemberDB";

// ---------------------------------------------------------------------------
// Internal data shapes (widen the DB interfaces so we can track extra fields)
// ---------------------------------------------------------------------------
interface StoredUser {
  id: number;
  username: string;
  hash: string;
}

interface StoredServer {
  server_id: number;
  server_name: string;
}

interface StoredChannel {
  channel_id: number;
  server_id: number;
  name: string;
}

interface StoredMessage {
  message_id: number;
  guild_id: number;
  channel_id: number;
  user_id: number;
  message_text: string;
}

interface StoredMember {
  user_id: number;
  server_id: number;
}

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------
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

  /** Generate a unique 8-char invite code */
  private _generateInviteCode(): string {
    let code: string;
    do {
      code = Math.random().toString(36).substring(2, 10);
    } while (this.invites.has(code));
    return code;
  }

  // -- session -------------------------------------------------------------
  private currentUserId: number | null = null;
  /** Set to true after _seedUser() completes (async crypto). */
  private seeded = false;

  // ------------------------------------------------------------------------
  // Constructor – seed structural data immediately; the dev user is seeded
  // lazily on first auth call so we can compute the SHA-256 hash properly.
  // ------------------------------------------------------------------------
  constructor() {
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
      message_text: "This is the in-memory dev backend — no PostgreSQL required.",
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
  private _memberKey(userId: number, serverId: number): string {
    return `${userId}-${serverId}`;
  }

  /** tiny artificial delay so calls still feel async */
  private _delay = (ms = 50) => new Promise((r) => setTimeout(r, ms));

  private _requireAuth(): number {
    if (this.currentUserId === null) {
      throw new Error("Not authenticated — login first.");
    }
    return this.currentUserId;
  }

  /**
   * Mirrors LoginController.computeHash so the seed user's stored hash
   * matches what the client sends.
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

  /** Lazily create the dev user with a properly-hashed password. */
  private async _ensureSeeded(): Promise<void> {
    if (this.seeded) return;
    this.seeded = true;
    const hash = await this._computeHash("dev", "password");
    this.users.set(1, { id: 1, username: "dev", hash });
    this.nextUserId = 2;
  }

  // ------------------------------------------------------------------------
  // Account
  // ------------------------------------------------------------------------
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

  async signup(username: string, hash: string): Promise<boolean> {
    await this._ensureSeeded();
    await this._delay();
    // Reject duplicate usernames
    for (const u of this.users.values()) {
      if (u.username === username) return false;
    }
    const id = this.nextUserId++;
    this.users.set(id, { id, username, hash });
    this.currentUserId = id;
    return true;
  }

  // ------------------------------------------------------------------------
  // User model
  // ------------------------------------------------------------------------
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
    return { created_server_id: serverId };
  }

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
    return { invite_code: code };
  }

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
    return true;
  }

  // ------------------------------------------------------------------------
  // Channel
  // ------------------------------------------------------------------------
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
    return { channel_id: channel.channel_id, server_id: channel.server_id, name: channel.name };
  }

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
    return {
      guild_id: msg.guild_id,
      channel_id: msg.channel_id,
      user_id: msg.user_id,
      message_id: msg.message_id,
      message_text: msg.message_text,
      author_name: authorName,
    };
  }

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
export const inMemoryDB = new InMemoryDB();
