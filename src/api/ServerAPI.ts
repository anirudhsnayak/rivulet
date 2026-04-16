import { updateUserModel } from "./UserModelAPI";
import { reloadChannels } from "./ChannelAPI";
import { setCurrentGuildById } from "../stores/slices/UserSlice";
import { store } from "../stores/store";

export async function createServer(serverParams: any) {
    const serverName = serverParams.spaceName;
    const response = await fetch('http://localhost:3000/api/server/', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            serverName: serverName,
        })
    });
    if (response.ok) {
        const data = await response.json();
        console.log('Server creation successful:', data);
        //TODO: this code shouldn't be part of the API
        await updateUserModel(); //TODO: we already have this information in data
        store.dispatch(setCurrentGuildById(data.created_server_id));
        reloadChannels();
    } else {
        console.error('Server creation failed:', response.statusText);
        // handle server creation failure
    }
}

export async function getInviteCode(serverId: number) {
    const response = await fetch(`http://localhost:3000/api/server/invite`, {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            serverId: serverId,
        })
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Invite code retrieval successful:', data);
        return data.invite_code;
    } else {
        console.error('Invite code retrieval failed:', response.statusText);
        // handle invite code retrieval failure
    }  
}