export type ApiMode = 'psql' | 'in-memory';

/** Flip this to 'psql' when you want to hit the real PostgreSQL backend.
 *  Keep it as 'in-memory' for offline / rapid UI development. */
export const API_MODE: ApiMode = 'in-memory';
