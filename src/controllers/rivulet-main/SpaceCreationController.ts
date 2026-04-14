import type { AppDispatch } from '../../stores/store';
import { setCurrentChannelToLast } from '../../stores/slices/UserSlice';
import { SpaceCreationState } from '../../models/global/SpaceCreationState';
import { createChannel, reloadChannels } from '../../api/ChannelAPI';
import { createServer } from '../../api/ServerAPI';

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

//TODO: kind of messy, refactor
async function handleChannelCreation(channelParams: any, dispatch: AppDispatch) {//useSelector((state: RootState) => state.UserModel.currentGuildId);
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
}

export { handleSpaceCreation };