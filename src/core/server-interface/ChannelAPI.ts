
export async function createChannel(serverId: number, channelName: string) {
    const response = await fetch('http://localhost:3000/api/channel/', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            channelName: channelName,
            serverId: serverId
        })
    });
    if (response.ok) {
        const data = await response.json();
        console.log('Channel creation successful:', data);
        return data;
    } else {
        console.error('Channel creation failed:', response.statusText);
    }
}

export async function requestChannels(serverId: number) {
    const response = await fetch(`http://localhost:3000/api/channel?serverId=${serverId}`, {
        method: 'GET',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
        const data = await response.json();

        console.log('Channels loaded:', data);
        return data;
    } else {
        console.error('Failed to load channels:', response.statusText);
    }
}

//export { requestChannels, createChannel };

// interface ChannelDB {
//     server_id: number;
//     server_name: string;
// }

// async function updateChannels(guildID: number) {
//     const userModel = await requestUserModel();
//      userModel.servers = userModel.servers.map((server: Server) => {
//         return Guild(server.server_id, server.server_name);
//     });
//     store.dispatch(setGuilds(userModel.servers));
// }


// export { updateChannels };