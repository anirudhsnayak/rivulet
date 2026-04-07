import { addMessage, removeMessage } from '../stores/UserModel';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../stores/store';
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
    const messages = useSelector((state: RootState) => state.UserModel.visibleMessages);
    const dispatch = useDispatch()
    return (
        <div style={messageListStyle}>
            <button
                onClick={() => dispatch(addMessage())}
                >
                Add Message
                </button>
                <button
                onClick={() => dispatch(removeMessage())}
                >
                Remove Message
                </button>
            {Array.from({ length: messages.length }, (_, index) => (
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
                    {messages[index].messageText}
                </Box>
            ))}
            <MessageField/>
        </div>

    );
}