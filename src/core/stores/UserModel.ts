import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Guild } from './Guild';
import Channel from './Channel';
import Message from './Message';

export interface UserState {
  guilds: Guild[];
  currentGuildId: Number;
  visibleChannels: Channel[];
  visibleMessages: Message[]
}

const initialState: UserState = {
  guilds: [],
  currentGuildId: -1,
  visibleChannels: [],
  visibleMessages: []
}

export const UserModel = createSlice({
  name: 'UserModel',
  initialState,
  reducers: {
    setGuilds: (state, action: PayloadAction<Guild[]>) => {
        state.guilds = action.payload;
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
        state.visibleChannels.push(new Channel(0, state.visibleChannels.length + 1));
    },
    removeChannel: (state) => {
        if (state.visibleChannels.length > 0) {
            state.visibleChannels.pop();
        }
    },
    addMessage: (state) => {
        state.visibleMessages.push(new Message(0, 0, state.visibleMessages.length + 1, 'This is a message'));
    },
    removeMessage: (state) => {
        if (state.visibleMessages.length > 0) {
            state.visibleMessages.pop();
        }
    },
    setCurrentGuildById: (state, action: PayloadAction<Number>) => {
        //we are given the guild id, we need to find the guild with that id and set it as the current guild
        state.currentGuildId = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setGuilds, addGuild, removeGuild, addChannel, removeChannel, addMessage, removeMessage, setCurrentGuildById } = UserModel.actions

export default UserModel.reducer
