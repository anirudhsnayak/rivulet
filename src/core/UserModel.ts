import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import Guild from './Guild';
import Channel from './Channel';
import Message from './Message';

export interface UserState {
  guilds: Guild[];
  visibleChannels: Channel[];
  visibleMessages: Message[]
}

const initialState: UserState = {
  guilds: [],
  visibleChannels: [],
  visibleMessages: []
}

export const UserModel = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    addGuild: (state) => {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        state.guilds.push(new Guild(0));
    },
    removeGuild: (state) => {
        if (state.guilds.length > 0) {
            state.guilds.pop();
        }
    },
    addNGuilds: (state, action: PayloadAction<number>) => {
        for (let i = 0; i < action.payload; i++) {
            state.guilds.push(new Guild(state.guilds.length + 1));
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
    }
  },
})

// Action creators are generated for each case reducer function
export const { addGuild, removeGuild, addNGuilds, addChannel, removeChannel, addMessage, removeMessage } = UserModel.actions

export default UserModel.reducer