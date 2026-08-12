/**
 * @file Member list — the rightmost column showing server members.
 *
 * Displays all members of the currently selected server with a count
 * header. Rendered in grid column 4 of the main layout.
 *
 * @see {@link docs/architecture.md#main-app-layout-css-grid} — grid layout docs
 */

import { useSelector } from 'react-redux';
import type { RootState } from '../../../stores/store';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem } from '@mui/material';
import PersonRemove from '@mui/icons-material/PersonRemove';
import { useServerPermissions } from '../../../hooks/useServerPermissions';
import { kickMember } from '../../../api/ServerManagementAPI';
import { reloadMembers } from '../../../api/MemberAPI';
import type { ServerMember } from '../../../models/server-hierarchy/ServerMember';

/** A single member row with optional selection highlight. */
const MemberEntry = styled(Box)<{ selected?: boolean }>(({ selected, theme }) => ({
    width: '100%',
    margin: '0.1rem 0.5rem',
    padding: '0.1rem 0.75rem',
    borderRadius: selected ? '6px' : '0px',
    backgroundColor: selected ? theme.palette.primary.lighter : 'transparent',
    display: 'flex',
    alignItems: 'top',
    justifyContent: 'flex-start',
    color: selected ? 'text.primary' : theme.palette.text.disabled,
    textAlign: 'center',
    '&:hover': {
        cursor: 'default',
        backgroundColor: selected ? theme.palette.primary.lighter : theme.palette.action.hover,
    },
}));

/** "Members — {count}" header row. */
const MemberListHeader = styled(Box)(({ theme }) => ({
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.5rem 0.75rem',
    display: 'flex',
    flexDirection: 'row' as const,
    color: theme.palette.text.disabled,
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    flexShrink: 0,
}));

/**
 * Member list — the rightmost panel showing all members of the currently
 * selected server. Displays each member's name and a total count header.
 */
export function MemberList() {
    const { isAdmin } = useServerPermissions();
    const username = useSelector((state: RootState) => state.RivuletState.currentUserName);
    const serverId = useSelector((state: RootState) => state.UserSlice.currentGuildId);
    const [kicking, setKicking] = useState<ServerMember | null>(null);
    const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; member: ServerMember } | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    async function confirmKick() {
        if (!kicking) return;
        setBusy(true);
        setError('');
        try {
            await kickMember(kicking.parentGuildId, kicking.memberUserId);
            await reloadMembers();
            setKicking(null);
        } catch (err) { setError(err instanceof Error ? err.message : 'Could not kick member.'); }
        finally { setBusy(false); }
    }
    const members = useSelector((state: RootState) => state.UserSlice.visibleMembers);
    const onlineUserIds = useSelector((state: RootState) =>
        state.UserSlice.presenceByServer[state.UserSlice.currentGuildId]);
    const online = new Set(onlineUserIds);
    const onlineCount = members.filter((member) => online.has(member.memberUserId)).length;
    return (
        <>
            <MemberListHeader>
                <span>Members &ndash; {members.length}<br />
                    {onlineUserIds ? `${onlineCount} online` : 'Presence unavailable'}
                </span>
            </MemberListHeader>
            {members.map((member) => {
                const status = !onlineUserIds ? 'Unknown' : online.has(member.memberUserId) ? 'Online' : 'Offline';
                return (
                    <MemberEntry key={member.memberUserId} sx={{ alignItems: 'center', gap: 1 }}
                        onContextMenu={event => {
                            if (!isAdmin || member.role === 'creator' || member.memberName === username) return;
                            event.preventDefault();
                            setContextMenu({ mouseX: event.clientX, mouseY: event.clientY, member });
                        }}>
                        <Tooltip title={status}>
                            <Box component="span" role="img" aria-label={`${member.memberName}: ${status}`}
                                sx={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                                    bgcolor: status === 'Online' ? 'success.main' : 'text.disabled',
                                    opacity: status === 'Unknown' ? 0.4 : 1 }} />
                        </Tooltip>
                        <Tooltip title={member.role}><Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.memberName}</Box></Tooltip>
                    </MemberEntry>
                );
            })}
            <Menu open={isAdmin && contextMenu?.member.parentGuildId === serverId}
                onClose={() => setContextMenu(null)} anchorReference="anchorPosition"
                anchorPosition={contextMenu ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}>
                <MenuItem sx={{ color: 'error.main' }} onClick={() => {
                    setError('');
                    setKicking(contextMenu?.member ?? null);
                    setContextMenu(null);
                }}>
                    <PersonRemove sx={{ fontSize: '1rem', mr: 1 }} />Kick User
                </MenuItem>
            </Menu>
            <Dialog open={!!kicking && kicking.parentGuildId === serverId && isAdmin} onClose={busy ? undefined : () => setKicking(null)}>
                <DialogTitle>Kick {kicking?.memberName}?</DialogTitle>
                <DialogContent>They can rejoin with an invite.
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                </DialogContent>
                <DialogActions>
                    <Button disabled={busy} onClick={() => setKicking(null)}>Cancel</Button>
                    <Button color="error" disabled={busy} onClick={() => void confirmKick()}>Kick User</Button>
                </DialogActions>
            </Dialog>
        </>

    );
}
