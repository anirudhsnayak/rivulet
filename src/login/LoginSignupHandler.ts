
export function handleLoginSignup(name: string, username: string, password: string) {
    if (name === 'login') {
        handleLogin(username, password);
    } else if (name === 'signup') {
        handleSignup(username, password);
    }
}

async function computeHash(username: string, password: string) : Promise<string> {
    let saltedPassword = username + password;
    let hashedPassword = await window.crypto.subtle.digest(
        'SHA-256',  
        new TextEncoder().encode(saltedPassword)
    );
    let hashArray = Array.from(new Uint8Array(hashedPassword));
    let hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}


async function handleLogin(username: string, password: string) {
    let hashHex = await computeHash(username, password);
    const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            hash: hashHex
        })
    });
    if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        // handle successful login
    } else {
        console.error('Login failed:', response.statusText);
        // handle login failure
    }
}

async function handleSignup(username: string, password: string) {
    let hashHex = await computeHash(username, password);
    const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            hash: hashHex
        })
    });
    if (response.ok) {
        const data = await response.json();
        console.log('Signup successful:', data);
        // handle successful signup
    } else {
        console.error('Signup failed:', response.statusText);
        // handle signup failure
    }
}