/**
 * @file Server (guild) API — create, invite, leave.
 *
 * Dual-mode functions for server management. Each function delegates to
 * {@link InMemoryDB} or sends HTTP requests based on {@link API_MODE}.
 *
 * @see {@link docs/architecture.md#space-creation-flow} — server creation flow
 * @see {@link docs/architecture.md#sharing-an-invite-server-owner} — invite flow
 */

import { updateUserModel } from "./UserModelAPI";
import { reloadChannels } from "./ChannelAPI";
import { reloadMessages } from "./MessageAPI";
import { setCurrentGuildById, setCurrentChannelToLast } from "../stores/slices/UserSlice";
import { store } from "../stores/store";
import { API_MODE } from "./ApiConfig";
import { inMemoryDB } from "./InMemoryDB";
import { reloadMembers } from "./MemberAPI";

/**
 * Creates a new server with the given name.
 *
 * In-memory: delegates to {@link InMemoryDB.createServer}, then refreshes the
 * user model and selects the new server's first channel.
 * PostgreSQL: POST to `/api/server/`.
 *
 * @todo The post-creation orchestration (reloadChannels, dispatch, reloadMessages)
 *       should not live in the API layer — refactor into the controller.
 *
 * @param serverParams - Object containing the server name.
 * @param serverParams.spaceName - The display name for the new server.
 */
export async function createServer(serverParams: { spaceName: string }) {
    const serverName = serverParams.spaceName;

    if (API_MODE === "in-memory") {
        const data = await inMemoryDB.createServer(serverName);
        console.log("Server creation successful (in-memory):", data);
        await updateUserModel();
        store.dispatch(setCurrentGuildById(data.created_server_id));
        await reloadChannels();
        await reloadMembers();
        store.dispatch(setCurrentChannelToLast());
        await reloadMessages();
        return;
    }

    const response = await fetch("http://localhost:3000/api/server/", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            serverName: serverName,
        }),
    });
    if (response.ok) {
        const data = await response.json();
        console.log("Server creation successful:", data);
        // TODO: this code shouldn't be part of the API
        await updateUserModel(); // TODO: we already have this information in data
        store.dispatch(setCurrentGuildById(data.created_server_id));
        await reloadChannels();
        await reloadMembers();
        store.dispatch(setCurrentChannelToLast());
        await reloadMessages();
    } else {
        console.error("Server creation failed:", response.statusText);
    }
}

/**
 * Retrieves the invite code for a given server.
 *
 * In-memory: delegates to {@link InMemoryDB.getInviteCode}.
 * PostgreSQL: POST to `/api/server/invite`.
 *
 * @param serverId - The ID of the server to get an invite for.
 * @returns The invite code string, or `undefined` on failure.
 */
export async function getInviteCode(serverId: number) {
    if (API_MODE === "in-memory") {
        const data = await inMemoryDB.getInviteCode(serverId);
        return data.invite_code;
    }

    const response = await fetch("http://localhost:3000/api/server/invite", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            serverId: serverId,
        }),
    });

    if (response.ok) {
        const data = await response.json();
        console.log("Invite code retrieval successful:", data);
        return data.invite_code;
    } else {
        console.error("Invite code retrieval failed:", response.statusText);
    }
}

/**
 * Removes the current user's membership from a server.
 *
 * In-memory: delegates to {@link InMemoryDB.leaveServer}.
 * PostgreSQL: POST to `/api/server/leave`.
 *
 * @param serverId - The ID of the server to leave.
 */
export async function leaveServerAPI(serverId: number, successorUserId?: number) {
    if (API_MODE === "in-memory") {
        await inMemoryDB.leaveServer(serverId, successorUserId);
        console.log("Left server (in-memory):", serverId);
        return;
    }

    const response = await fetch("http://localhost:3000/api/server/leave", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ serverId, successorUserId }),
    });

    if (response.ok) {
        console.log("Left server successfully:", serverId);
    } else {
        throw new Error("Failed to leave server. Please try again.");
    }
}
