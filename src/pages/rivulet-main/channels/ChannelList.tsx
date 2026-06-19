import { useSelector } from 'react-redux';
import type { RootState } from '../../../stores/store';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { openChannelCreationModal, selectChannel } from '../../../controllers/rivulet-main/ChannelController';
import { useState } from 'react';

const ChannelRow = styled(Box)<{ selected?: boolean }>(({ selected, theme }) => ({
    width: 'auto',
    margin: '0.25rem 0.5rem',
    padding: '0.25rem 0.75rem',
    borderRadius: selected ? '6px' : '0px',
    backgroundColor: selected ? theme.palette.primary.lighter : 'transparent',
    display: 'flex',
    alignItems: 'top',
    justifyContent: 'center',
    color: selected ? 'text.primary' : theme.palette.text.disabled,
    textAlign: 'center',
    '&:hover': {
        cursor: 'pointer',
    },
}));

const ChannelListContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as 'column',
    width: '100%',
    height: '100%',
    alignItems: 'center',      // Center horizontally
    justifyContent: 'center',
}

const ChannelListStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center', // Align to top
    flexGrow: 1,
}

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