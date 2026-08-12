# Rivulet

A Discord-like chat application, with servers, channels, and real-time messaging in the browser.

Rivulet is a React 19 single-page app built with Vite 7, Material UI 7, Redux Toolkit, and React Router 7. It runs entirely against an in-browser database by default, so you can clone it and start clicking around without setting up a backend.

## Features

- **Account creation and login** 
- **Persistent login sessions**
- **Multi-user Channels** 
- **Live Messaging**
- **Invites**
- **Light/Dark theme** 
## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 7 |
| UI | Material UI 7 (`@mui/material`, `@mui/icons-material`, `@mui/lab`) |
| State | Redux Toolkit + React Redux |
| Routing | React Router 7 |
| Language | TypeScript 5.8 (strict) |
| Backend | In-memory DB or PostgreSQL via HTTP |

## Getting started

**Prerequisites:** Node.js `^20.19.0` or `>=22.12.0` (required by Vite 7).

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

To use the sibling `../rivulet-server` backend, set `VITE_API_MODE=psql` in
`.env.local`. With PostgreSQL running and the backend dependencies, `.env`, and
schema configured, run `npm run dev:server` from this directory. It starts the
API using the backend's working directory and `.env`. Run `npm run dev` in a
second terminal for the frontend.

Start PostgreSQL first with `npm run dev:db` (Docker Desktop must be running).
This starts the existing `rivulet-postgres` container or creates it using the
backend's `.env` and the persistent `rivulet-data` volume, then waits for readiness.
Stop the API and run `npm run dev:db:migrate` when setting up or upgrading the
schema, then restart the API. This uses the backend's `.env`, preserves existing
data, and upgrades legacy membership roles and invite-code columns.

### Dev credentials

The in-memory backend seeds a ready-to-use account on first visit:

| Username | Password |
|---|---|
| `dev` | `password` |

You'll land in a seeded server, **Rivulet HQ**, containing a `#general` channel and a few sample messages.

To start fresh, clear the site's `localStorage` to drop the persisted database and re-seeds the defaults.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run dev:server` | Start the sibling rivulet-server API |
| `npm run dev:db` | Start PostgreSQL in Docker and wait until ready |
| `npm run dev:db:migrate` | Initialize or upgrade the PostgreSQL schema |
| `npm run build` | Type-check with `tsc -b`, then produce a production build |
| `npm run lint` | Run ESLint over all source files |
| `npm run preview` | Serve the production build locally |

## Project structure

```
src/
├── pages/          Route-level components (login, main app layout, invite)
├── controllers/    Business logic — called by pages, call APIs + dispatch
├── api/            Data access layer — dual-mode (in-memory vs PostgreSQL)
├── stores/slices/  Redux Toolkit slices (UserSlice, RivuletSlice)
├── models/         TypeScript interfaces
│   ├── server-hierarchy/   Domain models (Guild, Channel, Message, …)
│   ├── db/                 Database shapes (ServerDB, MessageDB, …)
│   └── global/             Redux state shapes
├── hooks/          useRestoreSession, useMessageStream
├── components/     Shared presentational components
└── theme/          MUI dark theme with custom palette extensions

docs/               Architecture reference
```

## Architecture

Data flows in one direction:

```
UI (pages/) → Controllers (controllers/) → API (api/) → Store (stores/) → UI
```

- **Pages** call controller functions on user interaction.
- **Controllers** orchestrate: they call API functions, then dispatch Redux actions.
- **API functions** read and write data in whichever backend is active.
- **Store** is a single Redux store with two slices — `UserSlice` (servers, channels, messages, members, and the current selections) and `RivuletSlice` (app-level state like `loggedIn` and `creatingSpace`). Components subscribe via `useSelector`.

Review [docs/architecture.md](docs/architecture.md) for further info.

## Backend modes

Every function in [src/api/](src/api/) is dual-mode, switched by a single constant in [ApiConfig.ts](src/api/ApiConfig.ts):

```ts
export const API_MODE: ApiMode = 'in-memory';  // or 'psql'
```

```ts
if (API_MODE === 'psql') {
  // fetch from http://localhost:3000/api/...
} else {
  // delegate to the InMemoryDB singleton
}
```

**`in-memory`** (default) delegates to `InMemoryDB` — a singleton holding everything in `Map`s, with a 50 ms artificial delay to mimic network latency, persisted to `localStorage` under `rivulet_db` on every mutation. No backend required.

**`psql`** sends HTTP requests to a PostgreSQL backend expected at `http://localhost:3000/api/*`. This backend is not part of this repository. Endpoints used:

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/account/login` | POST | Authenticate |
| `/api/account/signup` | POST | Register |
| `/api/user` | POST | Load the user's servers |
| `/api/server/` | POST | Create a server |
| `/api/server/invite` | POST | Fetch a server's invite code |
| `/api/server/join` | POST | Join via invite |
| `/api/server/leave` | POST | Leave a server |
| `/api/channel/` | POST | Create a channel |
| `/api/channel?serverId=` | GET | Channels in a server |
| `/api/message/` | POST | Create a message |
| `/api/message?serverId=&channelId=` | GET | Messages in a channel |
| `/api/member?serverId=` | GET | Members of a server |

All requests are sent with `credentials: "include"`.

## Routing

| Path | Component | Notes |
|---|---|---|
| `/` | → `/login` | Redirect |
| `/login` | `Login` | Tabbed login / signup |
| `/app` | `Rivulet` | Main workspace; requires auth |
| `/invite/:inviteId` | `Invite` | Stores the invite code, then routes to login or the app |

## Domain naming: Guild vs. Server

The same concept is called **Guild** in the domain models and Redux state, and **Server** in the database shapes and API layer. This is a known inconsistency being phased out — **prefer "Server" for new code**. See [TODO.md](TODO.md).

## Documentation

- [docs/architecture.md](docs/architecture.md) — full flow reference: login, session restore, grid layout, invite flow, Redux store, in-memory DB internals
- [TODO.md](TODO.md) — known technical debt and planned work
- [CLAUDE.md](CLAUDE.md) — guidance for AI-assisted development on this repo
