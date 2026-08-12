import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'vite';
import { presencePlugin } from './presence.ts';

test('SSE presence handles snapshots, multiple tabs, disconnects, and server isolation', async () => {
    const server = await createServer({
        configFile: false,
        plugins: [presencePlugin()],
        server: { host: '127.0.0.1', port: 0 },
    });
    await server.listen();
    const address = server.httpServer!.address();
    assert.ok(address && typeof address !== 'string');
    const base = `http://127.0.0.1:${address.port}`;
    const controllers: AbortController[] = [];
    const connect = async (userId: number, serverIds: number[]) => {
        const controller = new AbortController();
        controllers.push(controller);
        const response = await fetch(`${base}/api/dev/presence?userId=${userId}&serverIds=${serverIds}`, {
            signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
        });
        assert.equal(response.headers.get('content-type'), 'text/event-stream');
        const reader = response.body!.pipeThrough(new TextDecoderStream()).getReader();
        let buffer = '';
        return {
            close: () => controller.abort(),
            async next() {
                while (true) {
                    const end = buffer.indexOf('\n\n');
                    if (end >= 0) {
                        const frame = buffer.slice(0, end);
                        buffer = buffer.slice(end + 2);
                        const data = frame.split('\n').find((line) => line.startsWith('data: '));
                        if (data) return JSON.parse(data.slice(6));
                    } else {
                        const chunk = await reader.read();
                        assert.equal(chunk.done, false);
                        buffer += chunk.value;
                    }
                }
            },
        };
    };
    try {
        const invalid = await fetch(`${base}/api/dev/presence?userId=0&serverIds=1`);
        assert.equal(invalid.status, 400);
        const first = await connect(1, [1]);
        assert.deepEqual(await first.next(), { servers: [{ serverId: 1, onlineUserIds: [1] }] });
        const secondTab = await connect(1, [1]);
        assert.deepEqual((await first.next()).servers[0].onlineUserIds, [1]);
        const peer = await connect(2, [1]);
        assert.deepEqual((await first.next()).servers[0].onlineUserIds, [1, 2]);
        const isolated = await connect(3, [2]);
        assert.deepEqual((await isolated.next()).servers, [{ serverId: 2, onlineUserIds: [3] }]);
        assert.deepEqual((await first.next()).servers[0].onlineUserIds, [1, 2]);
        secondTab.close();
        assert.deepEqual((await first.next()).servers[0].onlineUserIds, [1, 2]);
        peer.close();
        assert.deepEqual((await first.next()).servers[0].onlineUserIds, [1]);
        // Reconnect receives a complete current snapshot, rather than missed deltas.
        const returning = await connect(2, [1]);
        assert.deepEqual((await returning.next()).servers[0].onlineUserIds, [1, 2]);
    } finally {
        controllers.forEach((controller) => controller.abort());
        await server.close();
    }
});
