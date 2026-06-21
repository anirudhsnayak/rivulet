/**
 * @file Login / signup controller — orchestrates authentication.
 *
 * Handles the full login/signup flow: hashing credentials, calling the
 * API layer, dispatching Redux actions, and persisting session data to
 * localStorage. Also provides the logout function that clears all state.
 *
 * @see {@link docs/architecture.md#login-flow} — full login flow documentation
 */

import { handleLogin, handleSignup } from "../../api/LoginAPI";
import { store } from "../../stores/store";
import { setLoggedIn, setCurrentUserName } from "../../stores/slices/RivuletSlice";
import { clearUserState } from "../../stores/slices/UserSlice";
import { clearPersistence, inMemoryDB } from "../../api/InMemoryDB";

const STORAGE_USERNAME_KEY = 'rivulet_username';
const STORAGE_HASH_KEY = 'rivulet_hash';

/**
 * Handles both login and signup form submission.
 *
 * Computes a SHA-256 hash of `username + password`, then delegates to
 * either {@link handleLogin} or {@link handleSignup} based on the `name`
 * parameter. On success, dispatches Redux actions and persists session
 * data to localStorage for restoration on reload.
 *
 * @param name - Auth mode — `"login"` or `"signup"`.
 * @param username - The user's display name / identifier.
 * @param password - The user's plaintext password (hashed before sending).
 * @returns `true` if authentication succeeded, `false` otherwise.
 */
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

/**
 * Logs the user out by clearing session data from the in-memory DB,
 * Redux state, and localStorage persistence.
 */
export async function handleLogout() {
    inMemoryDB.clearSession();
    clearPersistence();
    store.dispatch(clearUserState());
    store.dispatch(setLoggedIn(false));
    store.dispatch(setCurrentUserName(''));
}

/**
 * Computes a SHA-256 hex digest of `username + password`.
 *
 * Uses the Web Crypto API (`window.crypto.subtle.digest`) to produce
 * a hex-encoded hash that is stored in localStorage for session
 * restoration.
 *
 * @param username - Used as a salt prepended to the password.
 * @param password - The plaintext password to hash.
 * @returns The hex-encoded SHA-256 digest.
 */
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
