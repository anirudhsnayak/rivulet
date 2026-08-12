/**
 * @file Member API — fetch and reload server members.
 *
 * Dual-mode functions for member management. Each function delegates to
 * {@link InMemoryDB} or sends HTTP requests based on {@link API_MODE}.
 *
 * @see {@link MemberList} — the member UI component
 * @see {@link ServerMember} — the member domain model
 */

import { ServerMember } from "../models/server-hierarchy";
import { store } from "../stores/store";
import { type ServerMemberDB } from "../models/db/ServerMemberDB";
import { setMembers } from "../stores/slices/UserSlice";
import { API_MODE } from "./ApiConfig";
import { inMemoryDB } from "./InMemoryDB";

/**
 * Fetches all members of a given server.
 *
 * In-memory: delegates to {@link InMemoryDB.getMembers}.
 * PostgreSQL: GET `/api/member?serverId=...`.
 *
 * @param serverId - The ID of the server whose members to fetch.
 * @returns An array of {@link ServerMemberDB} objects (empty on failure).
 */
export async function getMembersInServer(serverId: number): Promise<ServerMemberDB[]> {
    if (API_MODE === "in-memory") {
        const data = await inMemoryDB.getMembers(serverId);
        console.log("Members loaded (in-memory):", data);
        return data.members;
    }

    const response = await fetch(`http://localhost:3000/api/member?serverId=${serverId}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        const data = await response.json();
        console.log("Members loaded:", data);
        return data.members;
    } else {
        console.error("Failed to load members:", response.statusText);
        return [];
    }
}

/**
 * Re-fetches members for the currently selected guild and updates Redux state.
 *
 * Includes a stale-guild guard: if the user switched servers during the fetch,
 * the result is discarded to avoid overwriting the new guild's members.
 */
export async function reloadMembers() {
    const currentGuildId = store.getState().UserSlice.currentGuildId;
    const members = await getMembersInServer(currentGuildId);
    // Guard: if guild changed during fetch, don't overwrite new guild's members
    const latestGuildId = store.getState().UserSlice.currentGuildId;
    if (latestGuildId !== currentGuildId) return;
    const updatedMembers = members.map((member: ServerMemberDB) => {
        return ServerMember(member.user_id, member.username, member.server_id, member.role);
    });
    store.dispatch(setMembers(updatedMembers));
}
