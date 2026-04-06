import { Guild } from "../stores/Guild";
import { setCurrentGuildById, setGuilds } from "../stores/UserModel";
import { store } from "../stores/store";
import { requestChannels } from "./ChannelAPI";

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

interface ServerDB {
    server_id: number;
    server_name: string;
}

async function updateUserModel() {
    const userModel = await requestUserModel();
     userModel.servers = userModel.servers.map((server: ServerDB) => {
        return Guild(server.server_id, server.server_name);
    });
    store.dispatch(setGuilds(userModel.servers));
    let currentGuildId = store.getState().UserModel.currentGuildId;
    const currentChannels = await requestChannels(currentGuildId);
    console.log('Current channels loaded:', currentChannels);
}


export { updateUserModel };