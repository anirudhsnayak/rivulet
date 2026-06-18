import { API_MODE } from "./ApiConfig";
import { inMemoryDB } from "./InMemoryDB";

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
