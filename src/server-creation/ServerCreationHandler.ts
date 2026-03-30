
import type { AppDispatch } from '../core/stores/store';
import { setGuilds } from '../core/stores/UserModel';

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
        // Update guilds in Redux store
        if (data.servers) {
            console.log('Updated guilds:', data.servers);
            //dispatch(setGuilds(data.servers));
        }
    } else {
        console.error('Server creation failed:', response.statusText);
        // handle server creation failure
    }
}

export { handleServerCreation };