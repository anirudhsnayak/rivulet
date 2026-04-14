import { Message } from "../models/server-hierarchy/Message";
import { store } from "../stores/store";
import { setMessages } from "../stores/slices/UserSlice";
import { type MessageDB } from "../models/db/MessageDB";

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

export async function requestMessages(serverId: number, channelId: number) {
    const response = await fetch(`http://localhost:3000/api/message?serverId=${serverId}&channelId=${channelId}`, {
        method: 'GET',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
        const data = await response.json();

        console.log('Messages loaded:', data);
        return data.messages;
    } else {
        console.error('Failed to load messages:', response.statusText);
    }
}
export async function reloadMessages(): Promise<void> {
    const currentGuildId = store.getState().UserModel.currentGuildId;
    const currentChannelId = store.getState().UserModel.currentChannelId;
    const messages = await requestMessages(currentGuildId, currentChannelId);
    const updatedMessages = messages.map((message: MessageDB) => {
        return Message(message.channel_id, message.user_id, message.message_id, message.message_text);
    });
    store.dispatch(setMessages(updatedMessages));
    console.log('Messages reloaded:', updatedMessages);
}
