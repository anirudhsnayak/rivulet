import { handleLogin, handleSignup } from "../../api/LoginAPI";
import { store } from "../../stores/store";
import { setLoggedIn } from "../../stores/slices/RivuletSlice";

export async function handleLoginSignup(name: string, username: string, password: string): Promise<boolean> {
    const hash = await computeHash(username, password);
    let successfulLogin = false;
    if (name === 'login') {
        successfulLogin = await handleLogin(username, hash);
    } else if (name === 'signup') {
        successfulLogin = await handleSignup(username, hash);
    }
    if(successfulLogin) store.dispatch(setLoggedIn(true));
    return successfulLogin;
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


