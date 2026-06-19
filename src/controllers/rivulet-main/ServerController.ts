import { store } from '../../stores/store';
import { setCurrentGuildById, setCurrentChannelById } from '../../stores/slices/UserSlice';
import { reloadChannels } from '../../api/ChannelAPI';
import { reloadMembers } from '../../api/MemberAPI';
import { reloadMessages } from '../../api/MessageAPI';

export async function switchToServer(guildId: number) {
    store.dispatch(setCurrentGuildById(guildId));
    await reloadChannels();
    await reloadMembers();
    // Auto-select the first channel in the server
    const channels = store.getState().UserSlice.visibleChannels;
    if (channels.length > 0) {
        store.dispatch(setCurrentChannelById(channels[0].channelId));
        await reloadMessages();
    }
}
