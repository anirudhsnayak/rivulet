/**
 * @file Space creation controller — creating servers and channels.
 *
 * Routes creation requests to the appropriate API function based on the
 * current {@link SpaceCreationState} value, handling both server and
 * channel creation flows with their associated post-creation steps
 * (reloading channels, selecting the new channel, reloading messages).
 *
 * @see {@link SpaceCreationModal} — the UI form that invokes this controller
 * @see {@link docs/architecture.md#space-creation-flow} — creation flow docs
 */

import type { AppDispatch } from '../../stores/store';
import { setCurrentChannelToLast } from '../../stores/slices/UserSlice';
import { SpaceCreationState } from '../../models/global/SpaceCreationState';
import { createChannel, reloadChannels } from '../../api/ChannelAPI';
import { createServer } from '../../api/ServerAPI';
import { reloadMessages } from '../../api/MessageAPI';

/**
 * Routes a space creation request to the appropriate handler based on the
 * current {@link SpaceCreationState}.
 *
 * @param spaceState - Whether creating a server or a channel.
 * @param spaceParams - Parameters including `guildId` and `spaceName`.
 * @param dispatch - Redux dispatch function.
 */
async function handleSpaceCreation(spaceState: SpaceCreationState, spaceParams: any, dispatch: AppDispatch) {
    switch(spaceState) {
        case SpaceCreationState.CreatingServer:
            await createServer(spaceParams);
            break;
        case SpaceCreationState.CreatingChannel:
            await handleChannelCreation(spaceParams, dispatch);
            break;
        default:
            console.error('Invalid space creation state:', spaceState);
    }
}

/**
 * Creates a new channel, reloads the channel list, selects the new channel,
 * and reloads messages.
 *
 * @todo This flow is kind of messy — refactor into clearer orchestration.
 *
 * @param channelParams - Object with `guildId` and `spaceName` (channel name).
 * @param dispatch - Redux dispatch function.
 */
//TODO: kind of messy, refactor
async function handleChannelCreation(channelParams: any, dispatch: AppDispatch) {
    const guildId = channelParams.guildId;
    const channelName = channelParams.spaceName;
    console.log('Creating channel with name:', channelName, 'in guild:', guildId);
    if(guildId === -1) {
        console.error('No guild selected for channel creation');
        return;
    }
    await createChannel(guildId, channelName);
    await reloadChannels();
    dispatch(setCurrentChannelToLast());
    await reloadMessages();
}

export { handleSpaceCreation };