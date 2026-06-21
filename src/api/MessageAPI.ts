/**
 * @file Message API — create, fetch, and reload messages.
 *
 * Dual-mode functions for message operations. Each function delegates to
 * {@link InMemoryDB} or sends HTTP requests based on {@link API_MODE}.
 *
 * @see {@link docs/architecture.md#message-sending-flow} — message flow docs
 */

import { Message } from "../models/server-hierarchy/Message";
import { store } from "../stores/store";
import { setMessages } from "../stores/slices/UserSlice";
import { type MessageDB } from "../models/db/MessageDB";
import { API_MODE } from "./ApiConfig";
import { inMemoryDB } from "./InMemoryDB";

/**
 * Creates (sends) a new message in the given channel.
 *
 * In-memory: delegates to {@link InMemoryDB.createMessage}, which also emits
 * a `Events.MessageCreated` event for real-time streaming.
 * PostgreSQL: POST to `/api/message/`.
 *
 * @param serverId - The guild to send the message in.
 * @param channelId - The channel to send the message in.
 * @param messageText - The text content of the message.
 * @returns The created message data from the backend.
 */
export async function createMessage(serverId: number, channelId: number, messageText: string) {
    if (API_MODE === "in-memory") {
        const data = await inMemoryDB.createMessage(serverId, channelId, messageText);
        console.log("Message sent (in-memory):", data);
        return data;
    }

    const response = await fetch("http://localhost:3000/api/message/", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            serverId: serverId,
            channelId: channelId,
            messageText: messageText,
        }),
    });
    if (response.ok) {
        const data = await response.json();
        console.log("Message sent:", data);
        return data;
    } else {
        console.error("Message sending failed:", response.statusText);
    }
}

/**
 * Fetches all messages for a given channel in a given server.
 *
 * In-memory: delegates to {@link InMemoryDB.getMessages}.
 * PostgreSQL: GET `/api/message?serverId=...&channelId=...`.
 *
 * @param serverId - The guild to load messages from.
 * @param channelId - The channel to load messages from.
 * @returns An array of {@link MessageDB} objects, or `undefined` on failure.
 */
export async function requestMessages(serverId: number, channelId: number) {
    if (API_MODE === "in-memory") {
        const data = await inMemoryDB.getMessages(serverId, channelId);
        console.log("Messages loaded (in-memory):", data);
        return data.messages;
    }

    const response = await fetch(
        `http://localhost:3000/api/message?serverId=${serverId}&channelId=${channelId}`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
    if (response.ok) {
        const data = await response.json();
        console.log("Messages loaded:", data);
        return data.messages;
    } else {
        console.error("Failed to load messages:", response.statusText);
    }
}

/**
 * Re-fetches messages for the currently selected channel and updates Redux state.
 */
export async function reloadMessages(): Promise<void> {
    const currentGuildId = store.getState().UserSlice.currentGuildId;
    const currentChannelId = store.getState().UserSlice.currentChannelId;
    const messages = await requestMessages(currentGuildId, currentChannelId);
    if (!messages) return;
    const updatedMessages = messages.map((message: MessageDB) => {
        return Message(message.guild_id, message.channel_id, message.message_id, message.message_text, message.author_name);
    });
    store.dispatch(setMessages(updatedMessages));
    console.log("Messages reloaded:", updatedMessages);
}
