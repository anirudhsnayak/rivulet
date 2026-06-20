# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```
npm run dev       # Start Vite dev server (HMR)
npm run build     # Type-check with tsc then production build
npm run lint      # ESLint on all source files
npm run preview   # Preview production build locally
```

When using `cd`, you must always wrap the directory you want to go to in quotes (e.g. `cd "/c/Example Folder") instead of using backslash escapes.

There is no test framework configured yet.

## Architecture

Rivulet is a Discord-like chat application — a React 19 SPA built with Vite 7, Material UI 7, Redux Toolkit, and React Router 7.

### Data flow (unidirectional)

```
UI (pages/) → Controllers (controllers/) → API (api/) → Store (stores/) → UI
```

- **Pages** call controller functions on user interaction.
- **Controllers** call API functions and dispatch Redux actions.
- **API functions** dual-mode: in-memory singleton (`InMemoryDB`) for dev, or HTTP fetch to `localhost:3000/api/*` for the real PostgreSQL backend. Switch via `API_MODE` in [ApiConfig.ts](src/api/ApiConfig.ts).
- **Store** is a single Redux store with two slices: `UserSlice` (guilds, channels, messages, members) and `RivuletSlice` (app-level state like `loggedIn`, `creatingSpace`).

### Key directories

| Directory | Purpose |
|---|---|
| `src/pages/` | Route-level React components (login, main app layout, invite) |
| `src/controllers/` | Business logic orchestrators — called by pages, call APIs + dispatch |
| `src/api/` | Data access layer — dual-mode (in-memory vs psql), dispatches to store |
| `src/stores/slices/` | Redux Toolkit slices — `UserSlice.ts` and `RivuletSlice.ts` |
| `src/models/` | TypeScript interfaces: domain models (`server-hierarchy/`), DB shapes (`db/`), Redux state (`global/`) |
| `src/components/` | Shared presentational components (`RivuletButton`, `RivuletTextField`) |
| `src/theme/` | MUI dark theme with custom palette extensions |

### Routing (React Router v7)

| Path | Component |
|---|---|
| `/` | Redirect to `/login` |
| `/login` | Login/signup page |
| `/app` | Main app layout (server list, channel list, messages, member list) |
| `/invite/:inviteId` | Stores invite code, redirects to login then to `/app` |

### Domain model dual-naming

The codebase uses "Guild" (domain models/Redux state) and "Server" (DB shapes/API) interchangeably for the same concept. This is an acknowledged issue in TODO.md — prefer "Server" for new code.

### API dual-mode pattern

Every API module follows this pattern:
```ts
if (API_MODE === 'psql') {
  // fetch from http://localhost:3000/api/...
} else {
  // delegate to InMemoryDB singleton (with 50ms artificial delay)
}
```

### TypeScript strictness

`noUnusedLocals` and `noUnusedParameters` are enabled in [tsconfig.app.json](tsconfig.app.json). Unused variables/params will cause build failures.

## Architecture reference

See [docs/architecture.md](docs/architecture.md) for the full login-to-app flow, CSS Grid layout breakdown, Redux store structure, InMemoryDB data model, and complete component tree.
