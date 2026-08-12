/**
 * @file SSE-like message stream hook — subscribes to real-time messages.
 *
 * Listens for `Events.MessageCreated` events from the in-memory backend
 * {@link EventBus} and appends matching messages (scoped to the current
 * guild and channel) to the Redux store in real time.
 *
 * PostgreSQL mode subscribes to the authenticated SSE endpoint and reloads
 * history after events and reconnects to recover any missed messages.
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
import { API_MODE } from '../api/ApiConfig';
import { reloadMessages } from '../api/MessageAPI';

/**
 * Subscribes to SSE-like message events from the in-memory backend
 * and appends new messages to the Redux store in real time.
 *
 * PostgreSQL subscriptions are scoped to the selected server and channel.
 */
export function useMessageStream() {
    const currentGuildId = useSelector(
        (state: RootState) => state.UserSlice.currentGuildId,
    );
    const currentChannelId = useSelector(
        (state: RootState) => state.UserSlice.currentChannelId,
    );

    useEffect(() => {
        if (API_MODE === 'psql') {
            if (currentGuildId <= 0 || currentChannelId <= 0) return;
            const params = new URLSearchParams({ serverId: String(currentGuildId), channelId: String(currentChannelId) });
            const source = new EventSource(`http://localhost:3000/api/sse/events?${params}`, { withCredentials: true });
            // Fetch after subscription, including reconnects, to recover missed messages.
            const refresh = () => { void reloadMessages(); };
            source.addEventListener('ready', refresh);
            source.addEventListener('message:created', refresh);
            return () => source.close();
        }
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
