import { updateUserModel } from "./UserModelAPI";
import { reloadChannels } from "./ChannelAPI";
import { setCurrentGuildById } from "../stores/slices/UserSlice";
import { store } from "../stores/store";
import { API_MODE } from "./ApiConfig";
import { inMemoryDB } from "./InMemoryDB";

export async function createServer(serverParams: { spaceName: string }) {
    const serverName = serverParams.spaceName;

    if (API_MODE === "in-memory") {
        const data = await inMemoryDB.createServer(serverName);
        console.log("Server creation successful (in-memory):", data);
        await updateUserModel();
        store.dispatch(setCurrentGuildById(data.created_server_id));
        reloadChannels();
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
        reloadChannels();
    } else {
        console.error("Server creation failed:", response.statusText);
    }
}

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
