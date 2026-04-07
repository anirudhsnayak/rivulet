import { Channel } from "../stores/Channel";
import { store } from "../stores/store";
import { setChannels } from "../stores/UserModel";

export async function createMessage(serverId: number, channelId: number, messageText: string) {
    const response = await fetch('http://localhost:3000/api/message/', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            serverId: serverId,
            channelId: channelId,
            messageText: messageText
        })
    });
    if (response.ok) {
        const data = await response.json();
        console.log('Message sent:', data);
        return data;
    } else {
        console.error('Message sending failed:', response.statusText);
    }
}

export async function requestMessages(serverId: number) {
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
export async function reloadMessages() {
    const currentGuildId = store.getState().UserModel.currentGuildId;
    const currentChannelId = store.getState().UserModel.currentChannelId;
    const channels = await requestMessages(currentGuildId);
    const updatedChannels = channels.map((channel: ChannelDB) => {
        return Channel(channel.server_id, channel.channel_id, channel.name);
    });
    store.dispatch(setChannels(updatedChannels));
    
}
