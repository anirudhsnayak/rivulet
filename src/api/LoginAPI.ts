/**
 * @file Login / signup API — dual-mode (in-memory vs PostgreSQL).
 *
 * Provides the {@link handleLogin} and {@link handleSignup} functions used
 * by {@link LoginController} to authenticate users. Delegates to the
 * in-memory DB or sends HTTP requests based on {@link API_MODE}.
 *
 * @see {@link LoginController} — orchestrator that calls these functions
 * @see {@link docs/architecture.md#login-flow} — login flow docs
 */

import { API_MODE } from "./ApiConfig";
import { inMemoryDB } from "./InMemoryDB";

/**
 * Authenticates a user with the given username and SHA-256 hash.
 *
 * In-memory mode: delegates to {@link InMemoryDB.login}.
 * PostgreSQL mode: POST to `/api/account/login`.
 *
 * @param username - The user's display name.
 * @param hash - SHA-256 hex digest of `username + password`.
 * @returns `true` if the credentials are valid, `false` otherwise.
 */
export async function handleLogin(username: string, hash: string): Promise<boolean> {
    if (API_MODE === "in-memory") {
        const ok = await inMemoryDB.login(username, hash);
        if (ok) {
            console.log("Login successful (in-memory):", username);
            return true;
        }
        console.error("Login failed (in-memory): bad credentials");
        return false;
    }

    const response = await fetch("http://localhost:3000/api/account/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            hash: hash,
        }),
    });
    if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        return true;
    } else {
        console.error("Login failed:", response.statusText);
    }
    return false;
}

/**
 * Registers a new user with the given username and SHA-256 hash.
 *
 * In-memory mode: delegates to {@link InMemoryDB.signup}.
 * PostgreSQL mode: POST to `/api/account/signup`.
 *
 * @param username - The desired display name (must be unique).
 * @param hash - SHA-256 hex digest of `username + password`.
 * @returns `true` if signup succeeded, `false` if the username already exists.
 */
export async function handleSignup(username: string, hash: string): Promise<boolean> {
    if (API_MODE === "in-memory") {
        const ok = await inMemoryDB.signup(username, hash);
        if (ok) {
            console.log("Signup successful (in-memory):", username);
            return true;
        }
        console.error("Signup failed (in-memory): username may already exist");
        return false;
    }

    const response = await fetch("http://localhost:3000/api/account/signup", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            hash: hash,
        }),
    });
    if (response.ok) {
        const data = await response.json();
        console.log("Signup successful:", data);
        return true;
    } else {
        console.error("Signup failed:", response.statusText);
    }
    return false;
}
