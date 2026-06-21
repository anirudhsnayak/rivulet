/**
 * @file SSE-like message stream hook — subscribes to real-time messages.
 *
 * Listens for `Events.MessageCreated` events from the in-memory backend
 * {@link EventBus} and appends matching messages (scoped to the current
 * guild and channel) to the Redux store in real time.
 *
 * Designed to be swappable with a real `EventSource` / `fetch` + stream
 * loop when a PostgreSQL SSE backend is connected — only the subscription
 * mechanism changes, the dispatch logic stays the same.
 *
 * @see {@link EventBus} — in-memory event system
 * @see {@link docs/architecture.md#message-sending-flow} — message flow docs
 */

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
