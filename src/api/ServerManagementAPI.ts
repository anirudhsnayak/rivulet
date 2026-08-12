import { API_MODE } from './ApiConfig';
import { inMemoryDB } from './InMemoryDB';

async function mutate(path: string, method: string, body: object): Promise<void> {
    const response = await fetch(`http://localhost:3000/api/${path}`, {
        method, credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error('Could not save this change. Check your permissions and try again.');
}

export async function deleteChannel(serverId: number, channelId: number): Promise<void> {
    if (API_MODE === 'in-memory') return inMemoryDB.deleteChannel(serverId, channelId);
    await mutate('channel', 'DELETE', { serverId, channelId });
}

export async function kickMember(serverId: number, userId: number): Promise<void> {
    if (API_MODE === 'in-memory') return inMemoryDB.kickMember(serverId, userId);
    await mutate('member/kick', 'POST', { serverId, userId });
}

export async function setMemberRole(serverId: number, userId: number, role: 'member' | 'admin'): Promise<void> {
    if (API_MODE === 'in-memory') return inMemoryDB.setMemberRole(serverId, userId, role);
    await mutate('member/role', 'PATCH', { serverId, userId, role });
}

export async function transferOwnership(serverId: number, successorUserId: number): Promise<void> {
    if (API_MODE === 'in-memory') return inMemoryDB.transferOwnership(serverId, successorUserId);
    await mutate('server/ownership', 'POST', { serverId, successorUserId });
}
