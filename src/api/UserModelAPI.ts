import { Guild } from "../models/server-hierarchy/Guild";
import { setGuilds } from "../stores/slices/UserSlice";
import { store } from "../stores/store";
import { requestChannels } from "./ChannelAPI";
import { getMembersInServer } from "./MemberAPI";
import { type ServerDB } from "../models/db/ServerDB";

async function requestUserModel() {
    const response = await fetch('http://localhost:3000/api/user', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
        const data = await response.json();

        console.log('User model loaded:', data);
        return data;
    } else {
        console.error('Failed to load user model:', response.statusText);
    }
}

export async function joinServerWithInvite(inviteCode: string) {
    //we fetch with the invite code as a POST parameter
    const response = await fetch('http://localhost:3000/api/server/join', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invite_code: inviteCode }),
    });
    if (response.ok) {
        const data = await response.json();
        console.log('Joined server successfully:', data);
        await updateUserModel();
    } else {
        console.error('Failed to join server:', response.statusText);
    }
}


//TODO: use thunks for this, they are cleaner 
async function updateUserModel() {
    const userModel = await requestUserModel();
    userModel.servers = userModel.servers.map((server: ServerDB) => {
        return Guild(server.server_id, server.server_name);
    });
    store.dispatch(setGuilds(userModel.servers));
}

export { requestUserModel, updateUserModel };