import { useSelector } from 'react-redux';
import type { RootState } from '../stores/store';
import { canManageServer } from '../models/server-hierarchy/ServerRole';

export function useServerPermissions() {
    const role = useSelector((state: RootState) => state.UserSlice.guilds
        .find(server => server.guildId === state.UserSlice.currentGuildId)?.role);
    return { role, isCreator: role === 'creator', isAdmin: canManageServer(role) };
}
