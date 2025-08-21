import { addChannel, removeChannel } from '../core/stores/UserModel';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
import Box from '@mui/material/Box';

export function ChannelList() {
    const channels = useSelector((state: RootState) => state.UserModel.visibleChannels);
    const dispatch = useDispatch()
    return (
        <div>
            <button
                onClick={() => dispatch(addChannel())}
                >
                Add Channel
                </button>
                <button
                onClick={() => dispatch(removeChannel())}
                >
                Remove Channel
                </button>
            {Array.from({ length: channels.length }, (_, index) => (
                <Box
                    key={index}
                    sx={{
                        width: 'auto',
                        margin: '0.5rem 0.5rem',
                        backgroundColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'top',
                        justifyContent: 'center',
                        color: 'text.primary',
                    }}
                >
                    {channels[index].channelName}
                </Box>
            ))}
        </div>

    );
}