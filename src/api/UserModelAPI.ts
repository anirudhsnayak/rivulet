import { Guild } from "../models/server-hierarchy/Guild";
import { setGuilds } from "../stores/slices/UserSlice";
import { store } from "../stores/store";
import { type ServerDB } from "../models/db/ServerDB";
import { API_MODE } from "./ApiConfig";
import { inMemoryDB } from "./InMemoryDB";
import { reloadChannels } from "./ChannelAPI";
import { reloadMembers } from "./MemberAPI";

async function requestUserModel() {
    if (API_MODE === "in-memory") {
        const data = await inMemoryDB.getUserModel();
        console.log("User model loaded (in-memory):", data);
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
        reloadChannels();
        reloadMembers();
    }
}

export { requestUserModel, updateUserModel };
