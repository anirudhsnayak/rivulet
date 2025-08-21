import { addMessage, removeMessage } from '../core/stores/UserModel';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store';
import Box from '@mui/material/Box';

export function MessageList() {
    const messages = useSelector((state: RootState) => state.UserModel.visibleMessages);
    const dispatch = useDispatch()
    return (
        <div>
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
        </div>

    );
}