export async function handleLogin(username: string, hash: string) {
    const response = await fetch('http://localhost:3000/api/account/login', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            hash: hash
        })
    });
    if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        return true;
    } else {
        console.error('Login failed:', response.statusText);
    }
    return false;
}

export async function handleSignup(username: string, hash: string) {
    const response = await fetch('http://localhost:3000/api/account/signup', {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            hash: hash
        })
    });
    if (response.ok) {
        const data = await response.json();
        console.log('Signup successful:', data);
        return true;
    } else {
        console.error('Signup failed:', response.statusText);
    }
    return false;
}