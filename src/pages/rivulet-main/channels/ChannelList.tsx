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
    flexDirection: 'column' as 'column',
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
    flexDirection: 'row' as 'row',
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
    flexDirection: 'column' as 'column',
    justifyContent: 'flex-start',
    flexGrow: 1,
    overflowY: 'auto' as 'auto',
    overflowX: 'hidden' as 'hidden',
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
    const channels = useSelector((state: RootState) => state.UserSlice.visibleChannels);
    const selectedChannel = useSelector((state: RootState) => state.UserSlice.currentChannelId);

    const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null);

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu({ mouseX: event.clientX, mouseY: event.clientY });
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    const handleAddChannel = () => {
        handleCloseContextMenu();
        openChannelCreationModal();
    };

    return (
        <div style={ChannelListContainerStyle}>
            <ChannelListHeader>
                <span># Channels</span>
                <AddButton onClick={openChannelCreationModal}>+</AddButton>
            </ChannelListHeader>
            <div style={ChannelListStyle} onContextMenu={handleContextMenu}>
                {Array.from({ length: channels.length }, (_, index) => (
                    <ChannelRow
                        key={index}
                        selected={selectedChannel === channels[index].channelId}
                        onClick={() => selectChannel(channels[index].channelId)}
                    >
                            # {channels[index].channelName}
                    </ChannelRow>
                ))}
                <Menu
                    open={contextMenu !== null}
                    onClose={handleCloseContextMenu}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        contextMenu !== null
                            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                            : undefined
                    }
                >
                    <MenuItem onClick={handleAddChannel}>Add Channel</MenuItem>
                </Menu>
            </div>
        </div>

    );
}