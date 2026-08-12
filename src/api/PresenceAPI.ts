import { API_MODE } from './ApiConfig';
import { inMemoryDB } from './InMemoryDB';

export interface PresenceSnapshot {
    servers: { serverId: number; onlineUserIds: number[] }[];
}

/** Validate the complete snapshot before replacing any state. */
export function parsePresenceSnapshot(data: string): PresenceSnapshot | null {
    try {
        const value = JSON.parse(data) as PresenceSnapshot;
        if (!value || !Array.isArray(value.servers)) return null;
        const seen = new Set<number>();
        for (const server of value.servers) {
            if (!server || !Number.isSafeInteger(server.serverId) || server.serverId <= 0 ||
                seen.has(server.serverId) || !Array.isArray(server.onlineUserIds) ||
                server.onlineUserIds.some((id) => !Number.isSafeInteger(id) || id <= 0)) return null;
            seen.add(server.serverId);
        }
        return value;
    } catch {
        return null;
    }
}

export function subscribeToPresence(
    serverIds: number[],
    onSnapshot: (snapshot: PresenceSnapshot) => void,
    onDisconnected: () => void,
): () => void {
    const params = new URLSearchParams({ serverIds: serverIds.join(',') });
    const inMemory = API_MODE === 'in-memory';
    if (inMemory) {
        const userId = inMemoryDB.getCurrentUserId();
        if (userId === null) return () => {};
        params.set('userId', String(userId));
    }
    const endpoint = inMemory ? '/api/dev/presence' : 'http://localhost:3000/api/presence';
    const source = new EventSource(`${endpoint}?${params}`, { withCredentials: true });
    let closed = false;
    source.addEventListener('presence:snapshot', (event: MessageEvent<string>) => {
        if (closed) return;
        const snapshot = parsePresenceSnapshot(event.data);
        if (snapshot && snapshot.servers.length === serverIds.length &&
            snapshot.servers.every((server) => serverIds.includes(server.serverId))) {
            onSnapshot(snapshot);
        }
    });
    // EventSource retries automatically; discard stale presence until a fresh snapshot arrives.
    source.onerror = () => { if (!closed) onDisconnected(); };
    return () => {
        closed = true;
        source.close();
    };
}
