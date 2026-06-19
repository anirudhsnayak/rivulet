import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../stores/store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { MessageField } from './MessageField';

const MessagesContainer = styled(Box)(() => ({
    flexGrow: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.125rem',
    justifyContent: 'flex-end',
    py: '0.5rem',
    px: '1rem',
}));

const MessageRow = styled(Box)(({ theme }) => ({
    padding: '0.15rem 0.75rem',
    borderRadius: '6px',
    lineHeight: 1.5,
    transition: 'background-color 0.1s ease',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const MessageInputArea = styled(Box)(() => ({
    display: 'flex',
    width: '100%',
}));

export function MessageList() {
    const messages = useSelector(
        (state: RootState) => state.UserSlice.visibleMessages,
    );
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    return (
        <>
            <MessagesContainer>
                {messages.length === 0 && (
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography color="text.secondary" variant="body2">
                            No messages yet. Say hello!
                        </Typography>
                    </Box>
                )}
                {messages.map((msg, index) => (
                    <MessageRow key={index}>
                        <Typography
                            component="span"
                            variant="body2"
                            fontWeight={600}
                            color="secondary"
                            sx={{ mr: 0.5 }}
                        >
                            {msg.senderName}:
                        </Typography>
                        <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{ wordBreak: 'break-word' }}
                        >
                            {msg.messageText}
                        </Typography>
                    </MessageRow>
                ))}
                <div ref={bottomRef} />
            </MessagesContainer>
            <MessageInputArea>
                <MessageField />
            </MessageInputArea>
        </>
    );
}
