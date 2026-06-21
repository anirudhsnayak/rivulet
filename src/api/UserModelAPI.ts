/**
 * @file User model API — fetch user data, join servers, hydrate Redux store.
 *
 * Provides the user model (list of servers the user belongs to) and invite
 * joining functionality. The {@link updateUserModel} function is a key
 * orchestration point that hydrates the Redux store with the user's guilds
 * and triggers channel/member reloading.
 *
 * @see {@link docs/architecture.md#session-restoration-on-reload} — session restore docs
 * @see {@link docs/architecture.md#receiving-an-invite} — invite flow docs
 */

import { Guild } from "../models/server-hierarchy/Guild";
import { setGuilds } from "../stores/slices/UserSlice";
import { store } from "../stores/store";
import { type ServerDB } from "../models/db/ServerDB";
import { API_MODE } from "./ApiConfig";
import { inMemoryDB } from "./InMemoryDB";
import { reloadChannels } from "./ChannelAPI";
import { reloadMembers } from "./MemberAPI";

/**
 * Fetches the current user's model (list of servers) from the backend.
 *
 * In-memory: delegates to {@link InMemoryDB.getUserModel}.
 * PostgreSQL: POST to `/api/user`.
 *
 * @returns An object with a `servers` array of {@link ServerDB}, or `undefined`
 *          on failure.
 */
async function requestUserModel() {
    if (API_MODE === "in-memory") {
        const data = await inMemoryDB.getUserModel();
        return data;
    }

    const response = await fetch("http://localhost:3000/api/user", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        const data = await response.json();
        console.log("User model loaded:", data);
        return data;
    } else {
        console.error("Failed to load user model:", response.statusText);
    }
}

/**
 * Joins a server using an invite code.
 *
 * In-memory: delegates to {@link InMemoryDB.joinServer}.
 * PostgreSQL: POST to `/api/server/join`.
 *
 * On success, refreshes the full user model via {@link updateUserModel}.
 *
 * @param inviteCode - The invite code from the shared invite link.
 */
export async function joinServerWithInvite(inviteCode: string) {
    if (API_MODE === "in-memory") {
        const ok = await inMemoryDB.joinServer(inviteCode);
        if (ok) {
            console.log("Joined server successfully (in-memory)");
            await updateUserModel();
        } else {
            console.error("Failed to join server (in-memory): invalid invite code");
        }
        return;
    }

    const response = await fetch("http://localhost:3000/api/server/join", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ invite_code: inviteCode }),
    });
    if (response.ok) {
        const data = await response.json();
        console.log("Joined server successfully:", data);
        await updateUserModel();
    } else {
        console.error("Failed to join server:", response.statusText);
    }
}

/**
 * Fetches the user model and hydrates the Redux store with the user's guilds.
 *
 * Converts {@link ServerDB} records to {@link Guild} domain models and
 * dispatches them via {@link setGuilds}. If the guilds update triggers an
 * auto-selection (via {@link UserSlice.setGuilds}), also reloads channels
 * and members for the newly selected guild.
 *
 * @todo Use Redux thunks for this — they are cleaner than calling store.dispatch
 *       directly from an API module.
 */
// TODO: use thunks for this, they are cleaner
async function updateUserModel() {
    const userModel = await requestUserModel();
    if (!userModel) return;
    userModel.servers = userModel.servers.map((server: ServerDB) => {
        return Guild(server.server_id, server.server_name);
    });
    store.dispatch(setGuilds(userModel.servers));

    // If setGuilds auto-selected the first guild, load its channels and members
    const currentGuildId = store.getState().UserSlice.currentGuildId;
    if (currentGuildId !== -1) {
        await reloadChannels();
        await reloadMembers();
    }
}

export { requestUserModel, updateUserModel };
