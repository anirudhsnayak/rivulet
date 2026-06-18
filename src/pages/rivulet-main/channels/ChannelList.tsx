import { removeChannel } from '../../../stores/slices/UserSlice';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../stores/store';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles'; 
import { openChannelCreationModal, selectChannel } from '../../../controllers/rivulet-main/ChannelController';
import { displayInviteCode } from '../../../controllers/rivulet-main/ServerController';

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

const InviteButtonStyle = {
    width: '100%',
    marginTop: 'auto',
    marginBottom: '0.5rem',
    backgroundColor: 'primary.main',    
    color: 'text.primary',
    '&:hover': {
        cursor: 'pointer',
        backgroundColor: 'primary.dark',
    },
}

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
    const dispatch = useDispatch();
    const channels = useSelector((state: RootState) => state.UserSlice.visibleChannels);
    const selectedChannel = useSelector((state: RootState) => state.UserSlice.currentChannelId);
    return (
        <div style={ChannelListContainerStyle}>
            <div style={ChannelListStyle}>
                {Array.from({ length: channels.length }, (_, index) => (
                    <ChannelRow
                        key={index}
                        selected={selectedChannel === channels[index].channelId}
                        onClick={() => selectChannel(channels[index].channelId)} 
                    >
                            # {channels[index].channelName}
                    </ChannelRow>
                ))}
                <button onClick={openChannelCreationModal}>
                Add Channel
                </button>
                <button
                onClick={() => dispatch(removeChannel())}
                >
                Remove Channel
                </button>
            </div>
            <button style={InviteButtonStyle} onClick={displayInviteCode}>
                Invite People
            </button>
        </div>

    );
}