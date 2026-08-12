/**
 * @file API mode configuration — switches between in-memory and PostgreSQL backends.
 *
 * Flip {@link API_MODE} to `'psql'` to hit the real PostgreSQL backend at
 * `localhost:3000/api/*`, or keep it as `'in-memory'` for offline / rapid UI
 * development using the in-memory singleton backed by localStorage.
 *
 * @see {@link InMemoryDB} — the in-memory backend
 * @see {@link docs/architecture.md#api-mode-configuration} — API mode docs
 */

/** Supported API backends. */
export type ApiMode = 'psql' | 'in-memory';

/** Flip this to 'psql' when you want to hit the real PostgreSQL backend.
 *  Keep it as 'in-memory' for offline / rapid UI development. */
export const API_MODE: ApiMode = import.meta.env.VITE_API_MODE === 'psql' ? 'psql' : 'in-memory';
