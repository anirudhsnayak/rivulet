import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { Guild, Channel, Message, ServerMember } from '../../models/server-hierarchy';
import type { UserState } from '../../models/global';

const initialState: UserState = {
  guilds: [],
  currentGuildId: -1,
  currentChannelId: -1,
  visibleChannels: [],
  visibleMessages: [],
  visibleMembers: [],
}

export const UserSlice = createSlice({
  name: 'UserSlice',
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
        state.visibleMessages.push(Message(0, 0, state.visibleMessages.length + 1, 'This is a message', 'Dev'));
    },
    removeMessage: (state) => {
        if (state.visibleMessages.length > 0) {
            state.visibleMessages.pop();
        }
    },
    setMembers(state, action: PayloadAction<ServerMember[]>) {
        state.visibleMembers = action.payload;
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
    },
    clearUserState: () => {
        return initialState;
    }
  },
})

// Action creators are generated for each case reducer function
export const {
    setGuilds, addGuild, removeGuild, setCurrentGuildById,
    setChannels, addChannel, removeChannel, setCurrentChannelById, setCurrentChannelToLast,
    setMessages, addMessage, removeMessage,
    setMembers, clearUserState,
} = UserSlice.actions

export default UserSlice.reducer
