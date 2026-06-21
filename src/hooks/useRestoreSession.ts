/**
 * @file Session restoration hook — re-authenticates on page reload.
 *
 * Reads persisted credentials from localStorage (`rivulet_username` and
 * `rivulet_hash`), logs the user back into the in-memory DB, and
 * dispatches the appropriate Redux actions to restore the authenticated
 * session. The app blocks rendering until this hook reports completion.
 *
 * @see {@link docs/architecture.md#session-restoration-on-reload} — session restore docs
 */

import { useState, useEffect } from 'react';
import { inMemoryDB } from '../api/InMemoryDB';
import { store } from '../stores/store';
import { setLoggedIn, setCurrentUserName } from '../stores/slices/RivuletSlice';
import { API_MODE } from '../api/ApiConfig';

const STORAGE_USERNAME_KEY = 'rivulet_username';
const STORAGE_HASH_KEY = 'rivulet_hash';

/**
 * Restores a user session from localStorage on component mount.
 *
 * Reads the persisted username and SHA-256 hash from localStorage.
 * If both exist and `API_MODE === 'in-memory'`, attempts to re-authenticate
 * via the in-memory DB. On success, dispatches `setLoggedIn(true)` and
 * sets the current user name. In PostgreSQL mode, this is a no-op
 * (a future server-side session check would go here).
 *
 * @returns `true` once the restoration check has completed (regardless of
 *          whether the user was actually logged in).
 */
export function useRestoreSession() {
    const [sessionRestored, setSessionRestored] = useState(false);

    useEffect(() => {
        const username = localStorage.getItem(STORAGE_USERNAME_KEY);
        const hash = localStorage.getItem(STORAGE_HASH_KEY);

        if (!username || !hash) {
            setSessionRestored(true);
            return;
        }

        if (API_MODE === 'in-memory') {
            inMemoryDB.login(username, hash).then((ok) => {
                if (ok) {
                    store.dispatch(setLoggedIn(true));
                    store.dispatch(setCurrentUserName(username));
                }
                setSessionRestored(true);
            }).catch(() => {
                setSessionRestored(true);
            });
        } else {
            // For psql mode, a future server-side session check would go here.
            setSessionRestored(true);
        }
    }, []);

    return sessionRestored;
}
