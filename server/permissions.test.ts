import assert from 'node:assert/strict';
import { test } from 'node:test';

test('server roles enforce permissions, ownership transfer, and persistence', async () => {
    const storage = new Map<string, string>();
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
    } });
    Object.defineProperty(globalThis, 'window', { configurable: true, value: { crypto: globalThis.crypto } });
    const { InMemoryDB } = await import('../src/api/InMemoryDB.ts');
    const db = new InMemoryDB();
    await db.signup('owner', 'owner-hash');
    const ownerId = db.getCurrentUserId();
    const { created_server_id: serverId } = await db.createServer('Permissions');
    const { invite_code: invite } = await db.getInviteCode(serverId);
    const { channels: [general] } = await db.getChannels(serverId);
    assert.equal((await db.getUserModel()).servers[0].role, 'creator');

    await db.signup('member', 'member-hash');
    const memberId = db.getCurrentUserId();
    await assert.rejects(db.getChannels(serverId), /not a member/);
    await assert.rejects(db.createMessage(serverId, general.channel_id, 'outsider'), /not a member/);
    await db.joinServer(invite);
    assert.equal((await db.getUserModel()).servers[0].role, 'member');
    await db.createMessage(serverId, general.channel_id, 'hello');
    await assert.rejects(db.createChannel(serverId, 'forbidden'), /Only admins/);
    await assert.rejects(db.deleteChannel(serverId, general.channel_id), /Only admins/);
    await assert.rejects(db.kickMember(serverId, ownerId), /Only admins/);
    await assert.rejects(db.setMemberRole(serverId, memberId, 'admin'), /Only the creator/);
    await assert.rejects(db.transferOwnership(serverId, memberId), /Only the creator/);

    await db.login('owner', 'owner-hash');
    await db.setMemberRole(serverId, memberId, 'admin');
    await db.login('member', 'member-hash');
    const channel = await db.createChannel(serverId, 'admin-channel');
    await db.createMessage(serverId, channel.channel_id, 'deleted with channel');
    await db.deleteChannel(serverId, channel.channel_id);
    await assert.rejects(db.createMessage(serverId, channel.channel_id, 'gone'), /Channel does not belong/);
    await assert.rejects(db.kickMember(serverId, ownerId), /Cannot kick/);
    await assert.rejects(db.kickMember(serverId, memberId), /Cannot kick/);
    await assert.rejects(db.setMemberRole(serverId, ownerId, 'member'), /Only the creator/);
    await assert.rejects(db.transferOwnership(serverId, ownerId), /Only the creator/);
    const { created_server_id: otherServer } = await db.createServer('Other');
    await assert.rejects(db.deleteChannel(otherServer, general.channel_id), /Channel does not belong/);
    await assert.rejects(db.createMessage(otherServer, general.channel_id, 'wrong server'), /Channel does not belong/);

    await db.signup('visitor', 'visitor-hash');
    const visitorId = db.getCurrentUserId();
    await db.joinServer(invite);
    await db.login('member', 'member-hash');
    await db.kickMember(serverId, visitorId);
    await db.login('visitor', 'visitor-hash');
    await assert.rejects(db.createMessage(serverId, general.channel_id, 'kicked'), /not a member/);
    await assert.rejects(db.getMessages(serverId, general.channel_id), /not a member/);
    await assert.rejects(db.getMembers(serverId), /not a member/);
    await assert.rejects(db.getInviteCode(serverId), /not a member/);

    await db.login('owner', 'owner-hash');
    await assert.rejects(db.transferOwnership(serverId, ownerId), /successor owner/);
    await assert.rejects(db.transferOwnership(serverId, visitorId), /successor owner/);
    await db.transferOwnership(serverId, memberId);
    assert.equal((await db.getUserModel()).servers.find(s => s.server_id === serverId)?.role, 'admin');
    await db.createChannel(serverId, 'previous-owner');
    await assert.rejects(db.setMemberRole(serverId, memberId, 'member'), /Only the creator/);
    await assert.rejects(db.transferOwnership(serverId, visitorId), /Only the creator/);
    const afterTransfer = new InMemoryDB();
    await afterTransfer.login('member', 'member-hash');
    const transferMembers = (await afterTransfer.getMembers(serverId)).members;
    assert.equal(transferMembers.length, 2);
    assert.equal(transferMembers.find(m => m.user_id === memberId)?.role, 'creator');
    assert.equal(transferMembers.find(m => m.user_id === ownerId)?.role, 'admin');
    await db.login('member', 'member-hash');
    await db.transferOwnership(serverId, ownerId);
    await db.login('owner', 'owner-hash');
    await db.setMemberRole(serverId, memberId, 'member');
    await db.login('member', 'member-hash');
    await assert.rejects(db.createChannel(serverId, 'demoted'), /Only admins/);
    await db.login('owner', 'owner-hash');
    await assert.rejects(db.leaveServer(serverId), /successor owner/);
    await assert.rejects(db.leaveServer(serverId, ownerId), /successor owner/);
    await assert.rejects(db.leaveServer(serverId, visitorId), /successor owner/);
    await assert.rejects(db.setMemberRole(serverId, ownerId, 'member'), /Cannot change/);
    await db.leaveServer(serverId, memberId);
    await assert.rejects(db.getMembers(serverId), /not a member/);
    await db.login('member', 'member-hash');
    assert.equal((await db.getMembers(serverId)).members.filter((m: { role: string }) => m.role === 'creator').length, 1);
    await db.createChannel(serverId, 'new-owner');

    const restored = new InMemoryDB();
    await restored.login('member', 'member-hash');
    assert.equal((await restored.getUserModel()).servers.find((s: { server_id: number }) => s.server_id === serverId).role, 'creator');
    await assert.rejects(restored.leaveServer(serverId), /successor owner/);

    // Legacy snapshots gain one deterministic owner; other members remain members.
    const snapshot = JSON.parse(storage.get('rivulet_db')!);
    for (const member of Object.values(snapshot.members) as { role?: string }[]) delete member.role;
    storage.set('rivulet_db', JSON.stringify(snapshot));
    const migrated = new InMemoryDB();
    await migrated.login('member', 'member-hash');
    assert.equal((await migrated.getMembers(serverId)).members[0].role, 'creator');
});
