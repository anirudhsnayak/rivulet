
import { updateUserModel } from '../core/server-interface/UserModelLoader';
import type { AppDispatch } from '../core/stores/store';
import { setCurrentGuildById } from '../core/stores/UserModel';

async function handleServerCreation(serverName: string, dispatch: AppDispatch) {
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
        // Update user model to include the new server
        await updateUserModel(); //TODO: we already have this information in data
        // Set the current guild to the newly created guild
        dispatch(setCurrentGuildById(data.created_server_id));
    } else {
        console.error('Server creation failed:', response.statusText);
        // handle server creation failure
    }
}

export { handleServerCreation };