import type { ServerResponse } from 'node:http';
import type { Plugin, Connect } from 'vite';

interface Connection {
    userId: number;
    serverIds: number[];
    response: ServerResponse;
}

/** Development adapter only: identities and memberships come from the local DB. */
export function presencePlugin(): Plugin {
    const connections = new Set<Connection>();

    const publish = () => {
        for (const connection of connections) {
            const servers = connection.serverIds.map((serverId) => ({
                serverId,
                onlineUserIds: [...new Set([...connections]
                    .filter((peer) => peer.serverIds.includes(serverId))
                    .map((peer) => peer.userId))],
            }));
            connection.response.write(`event: presence:snapshot\ndata: ${JSON.stringify({ servers })}\n\n`);
        }
    };

    const middleware: Connect.NextHandleFunction = (request, response, next) => {
        const url = new URL(request.url ?? '/', 'http://localhost');
        if (url.pathname !== '/api/dev/presence') return next();
        const userId = Number(url.searchParams.get('userId'));
        const serverIds = [...new Set((url.searchParams.get('serverIds') ?? '').split(',').map(Number))];
        if (request.method !== 'GET' || !Number.isSafeInteger(userId) || userId <= 0 ||
            serverIds.length > 100 || serverIds.some((id) => !Number.isSafeInteger(id) || id <= 0)) {
            response.writeHead(400).end('Invalid presence subscription');
            return;
        }
        response.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
        });
        response.write('retry: 3000\n\n');
        const connection = { userId, serverIds, response };
        connections.add(connection);
        const heartbeat = setInterval(() => response.write(': heartbeat\n\n'), 15000);
        response.on('close', () => {
            clearInterval(heartbeat);
            connections.delete(connection);
            publish();
        });
        publish();
    };

    return {
        name: 'rivulet-dev-presence',
        configureServer(server) {
            server.middlewares.use(middleware);
        },
        closeBundle() {
            for (const { response } of connections) response.end();
            connections.clear();
        },
    };
}
