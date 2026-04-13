
import { updateUserModel } from '../../api/UserAPI';
import type { AppDispatch } from '../../stores/store';
import { setCurrentChannelToLast, setCurrentGuildById } from '../../stores/slices/UserSlice';
import { SpaceCreationState } from '../../models/global/SpaceCreationState';
import { createChannel, reloadChannels } from '../../api/ChannelAPI';

async function handleSpaceCreation(spaceState: SpaceCreationState, spaceParams: any, dispatch: AppDispatch) {
    switch(spaceState) {
        case SpaceCreationState.CreatingServer:
            await handleServerCreation(spaceParams, dispatch);
            break;
        case SpaceCreationState.CreatingChannel:
            await handleChannelCreation(spaceParams, dispatch);
            break;
        default:
            console.error('Invalid space creation state:', spaceState);
    }
}

//TODO: probably move all the server stuff to the server-interface folder

async function handleServerCreation(serverParams: any, dispatch: AppDispatch) {
    const serverName = serverParams.spaceName;
    const response = await fetch('http://localhost:3000/api/server/', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            serverName: serverName,
        })
    });
    if (response.ok) {
        const data = await response.json();
        console.log('Server creation successful:', data);
        // Update user model to include the new server
        await updateUserModel(); //TODO: we already have this information in data
        // Set the current guild to the newly created guild
        dispatch(setCurrentGuildById(data.created_server_id));
        reloadChannels();
    } else {
        console.error('Server creation failed:', response.statusText);
        // handle server creation failure
    }
}

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