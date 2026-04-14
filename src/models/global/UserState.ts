import { Guild, Channel, Message, ServerMember } from '../server-hierarchy';

export interface UserState {
  guilds: Guild[];
  currentGuildId: number;
  currentChannelId: number;
  visibleChannels: Channel[];
  visibleMessages: Message[];
  visibleMembers: ServerMember[];
}