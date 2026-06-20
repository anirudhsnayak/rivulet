import { handleLogin, handleSignup } from "../../api/LoginAPI";
import { store } from "../../stores/store";
import { setLoggedIn, setCurrentUserName } from "../../stores/slices/RivuletSlice";
import { clearUserState } from "../../stores/slices/UserSlice";
import { clearPersistence, inMemoryDB } from "../../api/InMemoryDB";

const STORAGE_USERNAME_KEY = 'rivulet_username';
const STORAGE_HASH_KEY = 'rivulet_hash';

export async function handleLoginSignup(name: string, username: string, password: string): Promise<boolean> {
    const hash = await computeHash(username, password);
    let successfulLogin = false;
    if (name === 'login') {
        successfulLogin = await handleLogin(username, hash);
    } else if (name === 'signup') {
        successfulLogin = await handleSignup(username, hash);
    }
    if(successfulLogin) {
        store.dispatch(setLoggedIn(true));
        store.dispatch(setCurrentUserName(username));
        localStorage.setItem(STORAGE_USERNAME_KEY, username);
        localStorage.setItem(STORAGE_HASH_KEY, hash);
    }
    return successfulLogin;
}

export async function handleLogout() {
    inMemoryDB.clearSession();
    clearPersistence();
    store.dispatch(clearUserState());
    store.dispatch(setLoggedIn(false));
    store.dispatch(setCurrentUserName(''));
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


