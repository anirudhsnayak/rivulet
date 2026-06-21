/**
 * @file Redux slice for user/server data state.
 *
 * Manages all guild, channel, message, and member data visible to the user,
 * along with the currently selected guild and channel IDs.
 *
 * Several reducers contain side-effect logic that auto-selects a fallback
 * guild or resets related state when the current selection becomes invalid
 * (e.g. removing the currently selected guild).
 *
 * @see {@link UserState} — the state shape managed by this slice
 * @see {@link docs/architecture.md#userslice-userstate} — architecture docs
 */

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
    /**
     * Replaces the full guilds list and performs fallback selection logic:
     * - If the previously selected guild still exists in the new list, it is preserved.
     * - If not, and the list is non-empty, selects the first guild.
     * - If the list is empty, resets all selection and visible data to initial sentinels.
     */
    setGuilds: (state, action: PayloadAction<Guild[]>) => {
        state.guilds = action.payload;
        const currentStillExists = state.guilds.some((g) => g.guildId === state.currentGuildId);
        if (!currentStillExists) {
            if (state.guilds.length > 0) {
                state.currentGuildId = state.guilds[0].guildId;
            } else {
                state.currentGuildId = -1;
                state.currentChannelId = -1;
                state.visibleChannels = [];
                state.visibleMessages = [];
                state.visibleMembers = [];
            }
        }
    },
    /**
     * Appends a new guild with an auto-generated name and ID.
     * @deprecated In-memory only — kept for dev/demo. Real usage goes through
     *             {@link setGuilds} after a server API call.
     */
    addGuild: (state) => {
        state.guilds.push(Guild(state.guilds.length + 1, `Guild ${state.guilds.length + 1}`));
    },
    /**
     * Removes a guild by ID. If the removed guild was the current selection,
     * falls back to the first remaining guild or resets to initial state if empty.
     */
    removeGuild: (state, action: PayloadAction<number>) => {
        const guildId = action.payload;
        state.guilds = state.guilds.filter((g) => g.guildId !== guildId);
        if (state.currentGuildId === guildId) {
            if (state.guilds.length > 0) {
                state.currentGuildId = state.guilds[0].guildId;
            } else {
                state.currentGuildId = -1;
                state.currentChannelId = -1;
                state.visibleChannels = [];
                state.visibleMessages = [];
                state.visibleMembers = [];
            }
        }
    },
    /**
     * Appends an auto-generated channel to the visible channel list.
     * @deprecated In-memory only — kept for dev/demo. Real usage goes through
     *             {@link setChannels} after a channel API call.
     */
    addChannel: (state) => {
        state.visibleChannels.push(Channel(0, state.visibleChannels.length + 1, "Channel"));
    },
    /**
     * Removes the last visible channel from the list.
     * @deprecated In-memory only — kept for dev/demo.
     */
    removeChannel: (state) => {
        if (state.visibleChannels.length > 0) {
            state.visibleChannels.pop();
        }
    },
    /** Replaces the visible channel list (e.g. after switching servers). */
    setChannels: (state, action: PayloadAction<Channel[]>) => {
        state.visibleChannels = action.payload;
    },
    /** Replaces the visible message list (e.g. after switching channels or sending a message). */
    setMessages(state, action: PayloadAction<Message[]>) {
        state.visibleMessages = action.payload;
    },
    /** Appends a single message to the visible message list. */
    addMessage: (state, action: PayloadAction<Message>) => {
        state.visibleMessages.push(action.payload);
    },
    /**
     * Removes the last visible message from the list.
     * @deprecated In-memory only — kept for dev/demo.
     */
    removeMessage: (state) => {
        if (state.visibleMessages.length > 0) {
            state.visibleMessages.pop();
        }
    },
    /** Replaces the visible member list (e.g. after switching servers). */
    setMembers(state, action: PayloadAction<ServerMember[]>) {
        state.visibleMembers = action.payload;
    },
    /** Sets the currently selected guild by ID. */
    setCurrentGuildById: (state, action: PayloadAction<number>) => {
        state.currentGuildId = action.payload;
    },
    /** Sets the currently selected channel by ID. */
    setCurrentChannelById: (state, action: PayloadAction<number>) => {
        state.currentChannelId = action.payload;
    },
    /** Selects the last channel in the visible channel list. */
    setCurrentChannelToLast: (state) => {
        if(state.visibleChannels.length > 0) {
            state.currentChannelId = state.visibleChannels[state.visibleChannels.length - 1].channelId;
        }
    },
    /** Resets the entire user state back to its initial values (used on logout). */
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
