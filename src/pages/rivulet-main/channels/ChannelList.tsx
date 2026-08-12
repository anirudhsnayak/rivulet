/**
 * @file Channel list — the scrollable channel sidebar under {@link ServerInfo}.
 *
 * Displays all visible channels for the currently selected server.
 * Clicking a channel selects it via {@link selectChannel}. Right-clicking
 * opens a context menu with an "Add Channel" option.
 *
 * @see {@link selectChannel} — controller for channel switching
 * @see {@link openChannelCreationModal} — opens the space creation modal
 * @see {@link SpaceCreationModal} — the creation form modal
 */

import { useSelector } from 'react-redux';
import type { RootState } from '../../../stores/store';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { openChannelCreationModal, selectChannel } from '../../../controllers/rivulet-main/ChannelController';
import { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { useServerPermissions } from '../../../hooks/useServerPermissions';
import { deleteChannel } from '../../../api/ServerManagementAPI';
import { reloadChannels } from '../../../api/ChannelAPI';
import { reloadMessages } from '../../../api/MessageAPI';
import type { Channel } from '../../../models/server-hierarchy/Channel';

/**
 * A single channel row — highlighted when selected, clickable to switch.
 */
const ChannelRow = styled(Box)<{ selected?: boolean }>(({ selected, theme }) => ({
    width: 'auto',
    margin: '0.25rem 0.5rem',
    padding: '0.25rem 0.75rem',
    borderRadius: selected ? '6px' : '0px',
    backgroundColor: selected ? theme.palette.primary.lighter : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: selected ? 'text.primary' : theme.palette.text.disabled,
    textAlign: 'center',
    '&:hover': {
        cursor: 'pointer',
    },
}));

/** Outer container — full height, overflow hidden. */
const ChannelListContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
}

/** "# Channels" header row with a "+" add button. */
const ChannelListHeader = styled(Box)(({ theme }) => ({
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.5rem 0.75rem',
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    color: theme.palette.text.disabled,
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    flexShrink: 0,
}));

/** Small "＋" button for adding a channel. */
const AddButton = styled('button')(({ theme }) => ({
    background: 'none',
    border: 'none',
    color: theme.palette.text.disabled,
    fontSize: '1rem',
    lineHeight: 1,
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
        color: theme.palette.text.primary,
    },
    '&:focus': {
        outline: 'none',
    },
}));

/** Scrollable channel list region with right-click context menu support. */
const ChannelListStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'flex-start',
    flexGrow: 1,
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
}

/**
 * Channel list — the scrollable sidebar section showing all channels
 * in the currently selected server.
 *
 * Clicking a channel via {@link selectChannel} loads its messages.
 * Right-clicking opens a context menu to add a new channel via
 * {@link openChannelCreationModal}.
 */
export function ChannelList() {
    const { isAdmin } = useServerPermissions();
    const serverId = useSelector((state: RootState) => state.UserSlice.currentGuildId);
    const [deleting, setDeleting] = useState<Channel | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    async function confirmDelete() {
        if (!deleting) return;
        setBusy(true);
        setError('');
        try {
            await deleteChannel(deleting.parentGuildId, deleting.channelId);
            await reloadChannels();
            await reloadMessages();
            setDeleting(null);
        } catch (err) { setError(err instanceof Error ? err.message : 'Could not delete channel.'); }
        finally { setBusy(false); }
    }
    const channels = useSelector((state: RootState) => state.UserSlice.visibleChannels);
    const selectedChannel = useSelector((state: RootState) => state.UserSlice.currentChannelId);

    const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; serverId: number; channel?: Channel } | null>(null);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);

    const handleContextMenu = (event: React.MouseEvent, channel?: Channel) => {
        if (!isAdmin) return;
        event.preventDefault();
        event.stopPropagation();
        setContextMenu({ mouseX: event.clientX, mouseY: event.clientY, serverId, channel });
        setContextMenuOpen(true);
    };

    const handleCloseContextMenu = () => {
        // Keep the target and position stable throughout the closing animation.
        setContextMenuOpen(false);
    };

    const handleAddChannel = () => {
        handleCloseContextMenu();
        openChannelCreationModal();
    };

    return (
        <div style={ChannelListContainerStyle}>
            <ChannelListHeader>
                <span># Channels</span>
                {isAdmin && <AddButton aria-label="Create channel" onClick={openChannelCreationModal}>+</AddButton>}
            </ChannelListHeader>
            <div style={ChannelListStyle} onContextMenu={event => handleContextMenu(event)}>
                {Array.from({ length: channels.length }, (_, index) => (
                    <ChannelRow
                        key={channels[index].channelId}
                        selected={selectedChannel === channels[index].channelId}
                        onClick={() => selectChannel(channels[index].channelId)}
                        onContextMenu={event => handleContextMenu(event, channels[index])}
                    >
                            <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}># {channels[index].channelName}</Box>
                    </ChannelRow>
                ))}
                <Menu
                    open={contextMenuOpen && isAdmin && contextMenu?.serverId === serverId}
                    onClose={handleCloseContextMenu}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        contextMenu !== null
                            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                            : undefined
                    }
                >
                    {!contextMenu?.channel && <MenuItem onClick={handleAddChannel}>Add Channel</MenuItem>}
                    {contextMenu?.channel && <MenuItem sx={{ color: 'error.main' }} onClick={() => {
                        setError('');
                        setDeleting(contextMenu.channel ?? null);
                        handleCloseContextMenu();
                    }}>
                        <DeleteOutline sx={{ fontSize: '1rem', mr: 1 }} />Delete Channel
                    </MenuItem>}
                </Menu>
            </div>
            <Dialog open={!!deleting && deleting.parentGuildId === serverId && isAdmin} onClose={busy ? undefined : () => setDeleting(null)}>
                <DialogTitle>Delete #{deleting?.channelName}?</DialogTitle>
                <DialogContent>
                    This permanently deletes the channel and its messages.
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                </DialogContent>
                <DialogActions>
                    <Button disabled={busy} onClick={() => setDeleting(null)}>Cancel</Button>
                    <Button color="error" disabled={busy} onClick={() => void confirmDelete()}>Delete Channel</Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}
