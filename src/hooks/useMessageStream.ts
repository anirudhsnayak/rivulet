import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { eventBus, Events } from '../api/EventBus';
import { store } from '../stores/store';
import { addMessage } from '../stores/slices/UserSlice';
import { Message } from '../models/server-hierarchy/Message';
import type { MessageDB } from '../models/db/MessageDB';
import type { RootState } from '../stores/store';

/**
 * Subscribes to SSE-like message events from the in-memory backend
 * and appends new messages to the Redux store in real time.
 *
 * When a real SSE endpoint is connected, replace the EventBus subscription
 * with an EventSource / fetch + ReadableStream loop — the rest stays the same.
 */
export function useMessageStream() {
    const currentGuildId = useSelector(
        (state: RootState) => state.UserSlice.currentGuildId,
    );
    const currentChannelId = useSelector(
        (state: RootState) => state.UserSlice.currentChannelId,
    );

    useEffect(() => {
        const unsubscribe = eventBus.on(Events.MessageCreated, (data) => {
            const msg = data as MessageDB;
            if (msg.guild_id !== currentGuildId) return;
            if (msg.channel_id !== currentChannelId) return;

            store.dispatch(
                addMessage(
                    Message(
                        msg.guild_id,
                        msg.channel_id,
                        msg.message_id,
                        msg.message_text,
                        msg.author_name,
                    ),
                ),
            );
        });

        return unsubscribe;
    }, [currentGuildId, currentChannelId]);
}
