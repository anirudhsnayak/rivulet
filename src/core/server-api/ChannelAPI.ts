import { Channel } from "../stores/Channel";
import { store } from "../stores/store";
import { requestUserModel } from "./UserModelAPI";
import { setChannels } from "../stores/UserModel";

export async function createChannel(serverId: number, channelName: string) {
    const response = await fetch('http://localhost:3000/api/channel/', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            channelName: channelName,
            serverId: serverId
        })
    });
    if (response.ok) {
        const data = await response.json();
        console.log('Channel creation successful:', data);
        return data;
    } else {
        console.error('Channel creation failed:', response.statusText);
    }
}

export async function requestChannels(serverId: number) {
    const response = await fetch(`http://localhost:3000/api/channel?serverId=${serverId}`, {
        method: 'GET',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
        const data = await response.json();

        console.log('Channels loaded:', data);
        return data.channels;
    } else {
        console.error('Failed to load channels:', response.statusText);
    }
}

interface ChannelDB {
    name: string; //TODO: update the db to make this channel_name for consistency
    server_id: number;
    channel_id: number;
}
export async function reloadChannels() {
    const currentGuildId = store.getState().UserModel.currentGuildId;
    const channels = await requestChannels(currentGuildId);
    const updatedChannels = channels.map((channel: ChannelDB) => {
        return Channel(channel.server_id, channel.channel_id, channel.name);
    });
    store.dispatch(setChannels(updatedChannels));
    
}
