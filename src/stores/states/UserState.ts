import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Guild } from '../../models/message-hierarchy/Guild';
import { Channel } from '../../models/message-hierarchy/Channel';
import { Message } from '../../models/message-hierarchy/Message';

export interface UserState {
  guilds: Guild[];
  currentGuildId: number;
  currentChannelId: number;
  visibleChannels: Channel[];
  visibleMessages: Message[]
}

const initialState: UserState = {
  guilds: [],
  currentGuildId: -1,
  currentChannelId: -1,
  visibleChannels: [],
  visibleMessages: []
}

export const UserModel = createSlice({
  name: 'UserModel',
  initialState,
  reducers: {
    setGuilds: (state, action: PayloadAction<Guild[]>) => {
        state.guilds = action.payload;
        if(state.currentGuildId == -1 && state.guilds.length > 0) {
            state.currentGuildId = state.guilds[0].guildId;
        }
    },
    addGuild: (state) => {
        state.guilds.push(Guild(state.guilds.length + 1, `Guild ${state.guilds.length + 1}`));
    },
    removeGuild: (state) => {
        if (state.guilds.length > 0) {
            state.guilds.pop();
        }
    },
    addChannel: (state) => {
        state.visibleChannels.push(Channel(0, state.visibleChannels.length + 1, "Channel"));
    },
    removeChannel: (state) => {
        if (state.visibleChannels.length > 0) {
            state.visibleChannels.pop();
        }
    },
    setChannels: (state, action: PayloadAction<Channel[]>) => {
        state.visibleChannels = action.payload;
    },
    setMessages(state, action: PayloadAction<Message[]>) {
        state.visibleMessages = action.payload;
    },
    addMessage: (state) => {
        state.visibleMessages.push(Message(0, 0, state.visibleMessages.length + 1, 'This is a message'));
    },
    removeMessage: (state) => {
        if (state.visibleMessages.length > 0) {
            state.visibleMessages.pop();
        }
    },
    setCurrentGuildById: (state, action: PayloadAction<number>) => {
        state.currentGuildId = action.payload;
    },
    setCurrentChannelById: (state, action: PayloadAction<number>) => {
        state.currentChannelId = action.payload;
    },
    setCurrentChannelToLast: (state) => {
        if(state.visibleChannels.length > 0) {
            state.currentChannelId = state.visibleChannels[state.visibleChannels.length - 1].channelId;
        }
    }
  },
})

// Action creators are generated for each case reducer function
export const { 
    setGuilds, addGuild, removeGuild, setCurrentGuildById,
    setChannels, addChannel, removeChannel, setCurrentChannelById, setCurrentChannelToLast,
    setMessages, addMessage, removeMessage
} = UserModel.actions

export default UserModel.reducer
