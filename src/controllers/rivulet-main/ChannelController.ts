/**
 * @file Channel controller — selecting and creating channels.
 *
 * Provides the {@link selectChannel} function for switching the active view
 * to a different channel, and {@link openChannelCreationModal} for opening
 * the channel creation modal.
 *
 * @see {@link docs/architecture.md#channel-selection-flow} — channel flow docs
 */

import { store } from '../../stores/store';
import { setCreatingSpace } from '../../stores/slices/RivuletSlice';
import { setCurrentChannelById } from '../../stores/slices/UserSlice';
import { SpaceCreationState } from '../../models/global';
import { reloadMessages } from '../../api/MessageAPI';

/**
 * Opens the channel creation modal by setting the Redux creation state.
 */
export function openChannelCreationModal(){
    const state = store.getState();
    const server = state.UserSlice.guilds.find(g => g.guildId === state.UserSlice.currentGuildId);
    if (server?.role !== 'creator' && server?.role !== 'admin') return;
    store.dispatch(setCreatingSpace(SpaceCreationState.CreatingChannel));
}

/**
 * Selects a channel by ID and reloads its messages.
 *
 * If the channel is already selected, this is a no-op.
 *
 * @param channelId - The ID of the channel to select.
 */
export function selectChannel(channelId: number) {
    const currentChannelId = store.getState().UserSlice.currentChannelId;
    if(currentChannelId === channelId) return; // Channel is already selected, do nothing
    store.dispatch(setCurrentChannelById(channelId));
    reloadMessages();
}