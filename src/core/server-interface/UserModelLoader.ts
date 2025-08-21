async function requestUserModel() {
    const response = await fetch('http://localhost:3000/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
        const data = await response.json();

        console.log('User model loaded:', data);
        return data; // return the user model data
        // handle successful user model load
    } else {
        console.error('Failed to load user model:', response.statusText);
        // handle failure to load user model
    }

}   

async function updateUserModel() {
    let userModel = await requestUserModel()
    //convert servers to guilds 
    console.log(userModel.servers)
}

export { updateUserModel };