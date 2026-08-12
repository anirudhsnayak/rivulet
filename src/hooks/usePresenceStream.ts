import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { subscribeToPresence } from '../api/PresenceAPI';
import { store, type RootState } from '../stores/store';
import { clearPresence, setPresence } from '../stores/slices/UserSlice';

/** Keep one stream for all joined servers, independent of the selected channel. */
export function usePresenceStream() {
    const serverIdsKey = useSelector((state: RootState) =>
        state.UserSlice.guilds.map((server) => server.guildId).sort((a, b) => a - b).join(','));
    const loggedIn = useSelector((state: RootState) => state.RivuletState.loggedIn);

    useEffect(() => {
        store.dispatch(clearPresence());
        if (!loggedIn || !serverIdsKey) return;
        let unsubscribe: (() => void) | undefined;
        const disconnect = () => {
            unsubscribe?.();
            unsubscribe = undefined;
            store.dispatch(clearPresence());
        };
        const connect = () => {
            if (unsubscribe) return;
            unsubscribe = subscribeToPresence(
                serverIdsKey.split(',').map(Number),
                (snapshot) => store.dispatch(setPresence(snapshot)),
                () => store.dispatch(clearPresence()),
            );
        };
        connect();
        // Explicitly close on navigation and reconnect when restored from the back/forward cache.
        window.addEventListener('pagehide', disconnect);
        window.addEventListener('pageshow', connect);
        return () => {
            window.removeEventListener('pagehide', disconnect);
            window.removeEventListener('pageshow', connect);
            disconnect();
        };
    }, [loggedIn, serverIdsKey]);
}
