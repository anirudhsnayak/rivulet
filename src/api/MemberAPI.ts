import { ServerMember } from "../models/server-hierarchy";
import { store } from "../stores/store";
import { type ServerMemberDB } from "../models/db/ServerMemberDB";
import { setMembers } from "../stores/slices/UserSlice";
import { API_MODE } from "./ApiConfig";
import { inMemoryDB } from "./InMemoryDB";

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

export async function reloadMembers() {
    const currentGuildId = store.getState().UserSlice.currentGuildId;
    const members = await getMembersInServer(currentGuildId);
    const updatedMembers = members.map((member: ServerMemberDB) => {
        return ServerMember(member.user_id, `Member #${member.user_id}`, member.server_id);
    });
    store.dispatch(setMembers(updatedMembers));
}
