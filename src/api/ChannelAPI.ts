/**
 * @file Channel API — create, fetch, and reload channels.
 *
 * Dual-mode functions for channel management. Each function delegates to
 * {@link InMemoryDB} or sends HTTP requests based on {@link API_MODE}.
 *
 * @see {@link docs/architecture.md#channel-selection-flow} — channel flow docs
 */

import { Channel } from "../models/server-hierarchy";
import { store } from "../stores/store";
import { setChannels } from "../stores/slices/UserSlice";
import { type ChannelDB } from "../models/db/ChannelDB";
import { API_MODE } from "./ApiConfig";
import { inMemoryDB } from "./InMemoryDB";

/**
 * Creates a new channel in the given server.
 *
 * In-memory: delegates to {@link InMemoryDB.createChannel}.
 * PostgreSQL: POST to `/api/channel/`.
 *
 * @param serverId - The ID of the parent server.
 * @param channelName - The display name for the new channel.
 * @returns The created channel data from the backend.
 */
export async function createChannel(serverId: number, channelName: string) {
    if (API_MODE === "in-memory") {
        const data = await inMemoryDB.createChannel(serverId, channelName);
        console.log("Channel creation successful (in-memory):", data);
        return data;
    }

    const response = await fetch("http://localhost:3000/api/channel/", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            channelName: channelName,
            serverId: serverId,
        }),
    });
    if (response.ok) {
        const data = await response.json();
        console.log("Channel creation successful:", data);
        return data;
    } else {
        throw new Error("Could not create channel. Check your permissions and try again.");
    }
}

/**
 * Fetches all channels for a given server.
 *
 * In-memory: delegates to {@link InMemoryDB.getChannels}.
 * PostgreSQL: GET `/api/channel?serverId=...`.
 *
 * @param serverId - The ID of the server whose channels to fetch.
 * @returns An array of {@link ChannelDB} objects, or `undefined` on failure.
 */
export async function requestChannels(serverId: number) {
    if (API_MODE === "in-memory") {
        const data = await inMemoryDB.getChannels(serverId);
        console.log("Channels loaded (in-memory):", data);
        return data.channels;
    }

    const response = await fetch(`http://localhost:3000/api/channel?serverId=${serverId}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        const data = await response.json();
        console.log("Channels loaded:", data);
        return data.channels;
    } else {
        console.error("Failed to load channels:", response.statusText);
    }
}

/**
 * Re-fetches channels for the currently selected guild and updates Redux state.
 *
 * Includes a stale-guild guard: if the user switched servers during the fetch,
 * the result is discarded to avoid overwriting the new guild's channels.
 */
export async function reloadChannels() {
    const currentGuildId = store.getState().UserSlice.currentGuildId;
    const channels = await requestChannels(currentGuildId);
    // Guard: if guild changed during fetch, don't overwrite new guild's channels
    const latestGuildId = store.getState().UserSlice.currentGuildId;
    if (latestGuildId !== currentGuildId) return;
    if (!channels) return;
    const updatedChannels = channels.map((channel: ChannelDB) => {
        return Channel(channel.server_id, channel.channel_id, channel.name);
    });
    store.dispatch(setChannels(updatedChannels));
}
