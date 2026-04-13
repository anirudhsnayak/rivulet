import { handleLogin, handleSignup } from "../api/LoginAPI";

export async function handleLoginSignup(name: string, username: string, password: string) {
    const hash = await computeHash(username, password);
    if (name === 'login') {
        await handleLogin(username, hash);
    } else if (name === 'signup') {
        await handleSignup(username, hash);
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


