import { Guild } from '../message-hierarchy/Guild';
import { Channel } from '../message-hierarchy/Channel';
import { Message } from '../message-hierarchy/Message';

export interface UserState {
  guilds: Guild[];
  currentGuildId: number;
  currentChannelId: number;
  visibleChannels: Channel[];
  visibleMessages: Message[]
}