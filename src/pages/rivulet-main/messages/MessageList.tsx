import { useSelector } from 'react-redux';
import type { RootState } from '../../../stores/store';
import Box from '@mui/material/Box';
import { MessageField } from './MessageField';

const messageListStyle = {
    height: '100%',
    width: '100%',
    display: 'flex', 
    flexDirection: 'column' as 'column',
    justifyContent: 'flex-end' as 'flex-end',
};

export function MessageList() {
    const messages = useSelector((state: RootState) => state.UserSlice.visibleMessages);
    return (
        <div style={messageListStyle}>
            {Array.from({ length: messages.length }, (_, index) => (
                <Box
                    key={index}
                    sx={{
                        width: 'auto',
                        margin: '0.1rem 0.0rem',
                        backgroundColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'top',
                        justifyContent: 'center',
                        color: 'white',
                    }}
                >
                    {messages[index].messageText}
                </Box>
            ))}
            <MessageField/>
        </div>

    );
}