import { removeChannel } from '../stores/states/UserState';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../stores/store';
import Box from '@mui/material/Box';
import { setCreatingSpace, SpaceCreationState } from '../stores/states/RivuletState';
import { styled } from '@mui/material/styles'; 

const ChannelRow = styled(Box)<{ selected?: boolean }>(({ selected }) => ({
    width: 'auto',
    margin: '0.5rem 0.5rem',
    backgroundColor: 'primary.main',
    border: "1px solid",
    borderColor: selected ? 'red' : 'primary.light',
    display: 'flex',
    alignItems: 'top',
    justifyContent: 'center',
    color: 'text.primary',
    textAlign: 'center',
    '&:hover': {
        cursor: 'pointer',
    },
}));

export function ChannelList() {
    const channels = useSelector((state: RootState) => state.UserModel.visibleChannels);
    const dispatch = useDispatch();
    const selectedChannel = useSelector((state: RootState) => state.UserModel.currentChannelId);
    return (
        <div>
            <button
                onClick={() => { 
                    dispatch(setCreatingSpace(SpaceCreationState.CreatingChannel));
                }}
                >
                Add Channel
                </button>
                <button
                onClick={() => dispatch(removeChannel())}
                >
                Remove Channel
                </button>
            {Array.from({ length: channels.length }, (_, index) => (
                <ChannelRow
                    key={index}
                    selected={selectedChannel === channels[index].channelId}
                    onClick={() => {
                        dispatch(setCreatingSpace(SpaceCreationState.NotCreatingSpace));
                    }}
                >
                        # {channels[index].channelName}
                </ChannelRow>
            ))}
        </div>

    );
}