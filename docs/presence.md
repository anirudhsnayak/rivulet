# User presence over SSE

Run `npm run dev`, log in, and open a joined server. The member list shows
online/offline dots and the online count. A user is online while at least one
app tab has a presence connection. Background tabs remain online; this does
not track idle activity. The subscription covers every joined server, so
switching channels or servers does not disconnect it.

The Vite development server provides `GET /api/dev/presence?userId=1&serverIds=1,2`.
This is a real HTTP SSE stream with a heartbeat every 15 seconds. Connections
are counted per user, so closing one of several tabs does not mark the user
offline. Closing the last connection broadcasts a fresh snapshot. A network
loss is detected when the server observes the socket closing; this can take
longer than an explicit tab close. Presence is transient and resets on restart.

This development endpoint trusts the local database's user and server IDs.
It is only installed in the Vite dev server, not the static production build
or `vite preview`. Separate browsers still have independent local databases;
presence does not synchronize their accounts, memberships, or messages.

## Production API contract

With `API_MODE = 'psql'`, the client connects to
`http://localhost:3000/api/presence?serverIds=1,2` with session cookies.
The production backend is not part of this repository and must implement this
endpoint. It must authenticate the session, derive the user ID from that
session, and authorize all requested server memberships. It must never trust
a client-supplied user ID. Cross-origin deployments must allow the app's
specific origin and credentials.

Respond with `Content-Type: text/event-stream`, disable caching and proxy
buffering, and send a complete snapshot immediately on connection/reconnection
and whenever presence changes:

```text
event: presence:snapshot
data: {"servers":[{"serverId":1,"onlineUserIds":[1,7]},{"serverId":2,"onlineUserIds":[1]}]}

```

Include exactly the requested servers, including servers with no online users.
Track all connections per authenticated user; a user remains online until the
last connection closes. Filter broadcasts by membership and send keepalive
comments periodically. For multiple backend instances, use shared presence
state and pub/sub rather than process-local connection counts.

The client validates snapshots before updating Redux and discards stale state
on errors. It shows **Presence unavailable** until a valid snapshot arrives.
Native EventSource reconnects automatically. Logout, membership changes,
unmounting, and page navigation close the old stream; returning from the
browser back/forward cache opens a new one.

## Verification

`npm test` runs an HTTP integration test using Node 22.18+ or Node 24. It checks
initial snapshots, duplicate tabs, disconnects, server isolation, invalid
subscriptions, and a fresh snapshot on reconnect.

The client follows the browser's [EventSource API](https://developer.mozilla.org/en-US/docs/Web/API/EventSource).
