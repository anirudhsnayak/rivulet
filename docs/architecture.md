# Architecture

## Overview

For user presence, the development SSE endpoint, and the production API contract,
see [User presence over SSE](presence.md).

Rivulet is a Discord-like chat single-page application — a React 19 SPA built with Vite 7, Material UI 7, Redux Toolkit, and React Router 7. This document covers the high-level logic flow from login through app usage, and explains where data is stored at each stage.

---

## Data Flow (Unidirectional)

```
Pages → Controllers → API → Store → Pages
```

- **Pages** call controller functions on user interaction.
- **Controllers** orchestrate business logic: call API functions, then dispatch Redux actions.
- **API functions** either delegate to the in-memory database (`InMemoryDB`) or make HTTP requests to the PostgreSQL backend.
- **Store** is a single Redux store; components subscribe to state changes via `useSelector`.

---

## Login Flow

```
Login.tsx
  └─ LoginSignupEntry.tsx  (tabbed login/signup form)
       └─ handleLoginSignup(tab, username, password)  [LoginController.ts]
              ├─ computeHash(username, password)         → SHA-256 hex
              ├─ handleLogin / handleSignup               [LoginAPI.ts]
              │    └─ inMemoryDB.login / .signup         [InMemoryDB.ts]
              │         └─ stores user session in memory (currentUserId)
              │         └─ persists full DB snapshot to localStorage ('rivulet_db')
              └─ on success:
                   ├─ dispatch(setLoggedIn(true))
                   ├─ dispatch(setCurrentUserName(username))
                   └─ localStorage.setItem('rivulet_username', username)
                   └─ localStorage.setItem('rivulet_hash', hashHex)
       └─ on success → navigate('/app')
```

### localStorage keys

| Key | Value | Purpose |
|---|---|---|
| `rivulet_username` | Plaintext username | Session restore check |
| `rivulet_hash` | SHA-256 hex of `username + password` | Re-authentication on reload |
| `rivulet_db` | JSON blob of `DBSnapshot` | Full in-memory DB persistence |

---

## Session Restoration on Reload

```
App.tsx
  └─ useRestoreSession()  [src/hooks/useRestoreSession.ts]
       ├─ Reads rivulet_username + rivulet_hash from localStorage
       ├─ If both exist and API_MODE === 'in-memory':
       │    └─ inMemoryDB.login(username, hash)  → restores currentUserId
       │    └─ dispatch(setLoggedIn(true))
       └─ Sets sessionRestored = true
```

The app blocks rendering of `<Router>` and all routes until `sessionRestored` is `true`. While waiting, only `<ThemeProvider>` is rendered. Once restored, the user is either logged in (and can see `/app`) or logged out (redirected to `/login`).

> **Note:** `useRestoreSession` does **not** restore `currentUserName` — that is only set during an explicit login via `LoginController`. This is a known gap.

---

## Main App Layout (CSS Grid)

```
Rivulet.tsx
  └─ Outer Box: display: grid, 4 columns × 2 rows

+--------+----------+------------------+----------+
| Server |  Server  |                  |  Member  |
|  List  |  Info    |   MessageList    |  List    |
| (4rem) | Channel  |   (1fr)          | (10rem)  |
|        |  List    |                  |          |
|        | (10rem)  |                  |          |
+--------+----------+                  +          |
|          UserInfo          |                  |
|     (spans col 1-3)        |                  |
+--------+----------+------------------+----------+
```

Column definitions: `gridTemplateColumns: '4rem 10rem 1fr 10rem'`
Row definitions: `gridTemplateRows: '1fr 5rem'`

| Grid area | Placement | Content |
|---|---|---|
| Server List | row 1, col 1 | `<ServerList />` — server icons |
| Channel Sidebar | row 1, col 2 | `<ServerInfo />` (server name + invite button) + `<ChannelList />` (channel rows) |
| Message Area | rows 1-2, col 3 | `<MessageList />` + `<MessageField />` |
| Member List | rows 1-2, col 4 | `<MemberList />` — online members |
| User Info | row 2, col 1-2 | `<UserInfo />` — username + settings icon |

Overlays (span all columns, render via MUI Modal/portal): `<SpaceCreationModal />`, `<InviteReceivedModal />`

---

## Server Switching Flow

```
ServerList.tsx (click server icon)
  └─ switchToServer(guildId)  [ServerController.ts]
       ├─ requestChannels(guildId)                 [ChannelAPI.ts → InMemoryDB.getChannelsInServer()]
       ├─ getMembersInServer(guildId)               [MemberAPI.ts → InMemoryDB.getMembersInServer()]
       ├─ requestMessages(guildId, firstChannelId)  [MessageAPI.ts → InMemoryDB.getMessagesInChannel()]
       └─ Dispatches:
            ├─ setCurrentGuildById(guildId)
            ├─ setChannels(channels)
            ├─ setMembers(members)
            ├─ setCurrentChannelById(firstChannelId)
            └─ setMessages(messages)
```

### Channel Selection Flow

```
ChannelList.tsx (click channel row)
  └─ selectChannel(channelId)  [ChannelController.ts]
       ├─ dispatch(setCurrentChannelById(channelId))
       └─ reloadMessages()
            ├─ requestMessages(guildId, channelId)  [MessageAPI.ts]
            └─ dispatch(setMessages(messages))
```

---

## Message Sending Flow

```
MessageField.tsx (press Enter)
  └─ handleMessageSend(text)  [inline in component]
       ├─ reads currentGuildId + currentChannelId from store
       ├─ createMessage(guildId, channelId, text)  [MessageAPI.ts]
       │    └─ InMemoryDB stores message with auto-increment ID + author lookup
       └─ reloadMessages()
            └─ dispatch(setMessages(updatedMessages))
```

Messages are never optimistically added — the full message list is re-fetched after every send.

---

## Space Creation Flow

### Creating a Server

```
ServerList.tsx (click "+" icon)
  └─ dispatch(setCreatingSpace(SpaceCreationState.CreatingServer))
       └─ SpaceCreationModal.tsx opens
            └─ handleSpaceCreation(...)  [SpaceCreationController.ts]
                 ├─ createServer(serverName)  [ServerAPI.ts]
                 │    └─ InMemoryDB:
                 │         ├─ Creates server record
                 │         ├─ Adds creator as member
                 │         ├─ Generates invite code
                 │         ├─ Creates default "#general" channel
                 │         └─ Calls updateUserModel() → dispatch(setGuilds)
                 ├─ dispatch(setCurrentGuildById(createdServerId))
                 └─ reloadChannels()
```

### Creating a Channel

```
ChannelList.tsx (click "+" / right-click → "Add Channel")
  └─ dispatch(setCreatingSpace(SpaceCreationState.CreatingChannel))
       └─ SpaceCreationModal.tsx opens
            └─ handleSpaceCreation(...)  [SpaceCreationController.ts]
                 ├─ createChannel(guildId, channelName)  [ChannelAPI.ts]
                 ├─ reloadChannels()
                 ├─ dispatch(setCurrentChannelToLast())
                 └─ reloadMessages()
```

---

## Invite Flow

### Receiving an Invite

```
/invite/:inviteId
  └─ Invite.tsx
       ├─ dispatch(setPendingInvite(inviteId))
       ├─ if logged in → navigate('/app')
       └─ if not logged in → navigate('/login')
            └─ after login → navigate('/app')
                 └─ Rivulet.tsx mounts → InviteReceivedModal.tsx opens
                      ├─ Accept  → joinServerWithInvite(inviteCode)
                      │             [UserModelAPI.ts → InMemoryDB.joinServer()]
                      │             └─ adds user as member → updateUserModel()
                      └─ Decline → dispatch(setPendingInvite(null))
```

### Sharing an Invite (Server Owner)

```
ServerInfo.tsx → InviteModal.tsx
  └─ getServerInviteCode(serverId)  [ServerAPI.ts → InMemoryDB]
       └─ Returns invite code → displayed in modal → user copies link
```

---

## Redux Store Structure

```
store (configureStore)
  ├─ UserSlice:     guilds, channels, messages, members + current selections
  └─ RivuletState:  loggedIn, currentUserName, creatingSpace, pendingInvite
```

### UserSlice (`UserState`)

| Field | Type | Initial | Description |
|---|---|---|---|
| `guilds` | `Guild[]` | `[]` | Servers the user belongs to |
| `currentGuildId` | `number` | `-1` | Currently selected server |
| `currentChannelId` | `number` | `-1` | Currently selected channel |
| `visibleChannels` | `Channel[]` | `[]` | Channels in the selected server |
| `visibleMessages` | `Message[]` | `[]` | Messages in the selected channel |
| `visibleMembers` | `ServerMember[]` | `[]` | Members in the selected server |

### RivuletState

| Field | Type | Initial | Description |
|---|---|---|---|
| `loggedIn` | `boolean` | `false` | Whether user has an active session |
| `currentUserName` | `string` | `''` | Logged-in username |
| `creatingSpace` | `SpaceCreationState` | `NotCreatingSpace` | Modal state for server/channel creation |
| `pendingInvite` | `string \| null` | `null` | Pending invite code from `/invite/:id` |

### SpaceCreationState enum

```
NotCreatingSpace = 0
CreatingServer   = 1
CreatingChannel  = 2
```

---

## Domain Models

### Server-hierarchy (used in Redux / UI)

| Model | Factory | Fields |
|---|---|---|
| `Guild` | `Guild(id, name)` | `guildId`, `guildName` |
| `Channel` | `Channel(parentGuildId, channelId, channelName)` | `parentGuildId`, `channelId`, `channelName` |
| `Message` | `Message(guildId, channelId, messageId, text, senderName)` | `guildId`, `channelId`, `messageId`, `messageText`, `senderName` |
| `ServerMember` | `ServerMember(userId, name, parentGuildId)` | `memberUserId`, `memberName`, `parentGuildId` |

### DB shapes (used in API layer)

| Interface | Fields |
|---|---|
| `UserModelDB` | `servers: ServerDB[]` |
| `ServerDB` | `server_id`, `server_name` |
| `ChannelDB` | `name`, `server_id`, `channel_id` |
| `MessageDB` | `guild_id`, `channel_id`, `user_id`, `message_id`, `message_text`, `author_name` |
| `ServerMemberDB` | `user_id`, `server_id`, `username` |

> **Known naming inconsistency:** The codebase uses "Guild" (domain models/Redux) and "Server" (DB/API) interchangeably for the same concept. See [TODO.md](../TODO.md).

---

## In-Memory Database (`InMemoryDB`)

The in-memory DB is a singleton class that holds all data in `Map` instances. It is the default storage backend when `API_MODE === 'in-memory'`.

### Internal state

| Map | Key | Value | Purpose |
|---|---|---|---|
| `users` | `number` (userId) | `StoredUser` | All registered users |
| `servers` | `number` (serverId) | `StoredServer` | All servers |
| `channels` | `number` (channelId) | `StoredChannel` | All channels |
| `messages` | `number` (messageId) | `StoredMessage` | All messages |
| `members` | `'userId-serverId'` | `StoredMember` | Membership join table |
| `invites` | `string` (invite code) | `number` (serverId) | Invite code → server lookup |
| `serverInvites` | `number` (serverId) | `string` (invite code) | Server → invite code lookup |

### Persistence

The full database is serialized to JSON and stored in `localStorage` under key `'rivulet_db'` every time a mutation occurs (`_persist()`). On construction, it calls `loadSnapshot()` to restore from localStorage. If no snapshot exists, it seeds default data:

- Server: "Rivulet HQ" (id 1)
- Channel: "#general" in server 1
- Dev user: `dev` / `password` (created lazily in `_ensureSeeded()`)
- 3 sample messages
- A valid invite code for server 1

### API mode configuration

```ts
// src/api/ApiConfig.ts
export type ApiMode = 'psql' | 'in-memory';
export const API_MODE: ApiMode = 'in-memory';
```

Every API function follows this pattern:

```ts
if (API_MODE === 'psql') {
  const response = await fetch('http://localhost:3000/api/...', { ... });
  // handle response
} else {
  const data = await inMemoryDB.someMethod(...);
  // return data
}
```

---

## Component Tree

```
main.tsx
  └─ <Provider store={store}>
       └─ <App />  (session-restore guard, Router)
            ├─ /login → <Login>
            │              └─ <LoginSignupEntry>
            │                   ├─ Login tab  → <LoginSignupPortal>
            │                   └─ Sign Up tab → <LoginSignupPortal>
            ├─ /app → <Rivulet>              (CSS Grid layout)
            │         ├─ <SpaceCreationModal>   (overlay)
            │         ├─ <InviteReceivedModal>  (overlay)
            │         ├─ <ServerList>           (col 1)
            │         ├─ <ServerInfo>           (col 2 top)
            │         │    └─ <InviteModal>
            │         ├─ <ChannelList>          (col 2 bottom)
            │         ├─ <MessageList>          (col 3)
            │         │    └─ <MessageField>    (col 3 bottom)
            │         ├─ <MemberList>           (col 4)
            │         └─ <UserInfo>             (row 2, col 1-2)
            └─ /invite/:inviteId → <Invite>  (redirects to /app or /login)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 7 |
| UI library | Material UI 7 |
| State management | Redux Toolkit |
| Routing | React Router 7 |
| Language | TypeScript (strict mode) |
| Dev backend | In-memory DB (singleton, localStorage-persisted) |
| Production backend | PostgreSQL via `localhost:3000/api/*` |

---

## Known Technical Debt

1. Split `UserModelAPI` into more relevant subcomponents
2. Create a frontend logger
3. Move store-server communication out of API files into a separate layer
4. Standardize the Guild/Server naming inconsistency
5. `useRestoreSession` does not restore `currentUserName` — only `setLoggedIn(true)` is dispatched
6. Logout function exists in `LoginController` but no UI is wired to it
