import { useState, useEffect } from 'react';
import { inMemoryDB } from '../api/InMemoryDB';
import { store } from '../stores/store';
import { setLoggedIn, setCurrentUserName } from '../stores/slices/RivuletSlice';
import { API_MODE } from '../api/ApiConfig';

const STORAGE_USERNAME_KEY = 'rivulet_username';
const STORAGE_HASH_KEY = 'rivulet_hash';

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
