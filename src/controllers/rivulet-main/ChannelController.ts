import { store } from '../../stores/store';
import { setCreatingSpace } from '../../stores/slices/RivuletSlice';
import { setCurrentChannelById } from '../../stores/slices/UserSlice';
import { SpaceCreationState } from '../../models/global';
import { reloadMessages } from '../../api/MessageAPI';


export function openChannelCreationModal(){
    store.dispatch(setCreatingSpace(SpaceCreationState.CreatingChannel));  
}

export function selectChannel(channelId: number) {
    const currentChannelId = store.getState().UserSlice.currentChannelId;
    if(currentChannelId === channelId) return; // Channel is already selected, do nothing
    store.dispatch(setCurrentChannelById(channelId));
    reloadMessages();
}