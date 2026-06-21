/**
 * @file Event bus — lightweight pub/sub for in-memory cross-module events.
 *
 * Provides a simple publish/subscribe mechanism used by the in-memory backend
 * to notify the UI of new messages (simulating SSE/WebSocket push without a
 * real server). The {@link useMessageStream} hook subscribes to these events
 * to append messages in real time.
 *
 * @see {@link useMessageStream} — hook that subscribes to message events
 * @see {@link docs/architecture.md#message-sending-flow} — SSE flow docs
 */

/** Event listener callback type. */
type Listener = (data: unknown) => void;

/**
 * Lightweight in-memory event bus.
 *
 * Supports typed event names via the {@link Events} constant and provides
 * automatic cleanup via the unsubscribe function returned by {@link on}.
 */
class EventBus {
    private listeners = new Map<string, Set<Listener>>();

    /**
     * Registers a listener for an event.
     *
     * @param event - The event name to listen for.
     * @param listener - Callback invoked with the event payload.
     * @returns An unsubscribe function that removes this listener.
     */
    on(event: string, listener: Listener): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(listener);
        return () => this.off(event, listener);
    }

    /**
     * Removes a listener for an event.
     *
     * @param event - The event name.
     * @param listener - The listener to remove.
     */
    off(event: string, listener: Listener): void {
        this.listeners.get(event)?.delete(listener);
    }

    /**
     * Emits an event, calling all registered listeners with the data.
     * Errors in individual listeners are caught and logged.
     *
     * @param event - The event name to emit.
     * @param data - Arbitrary payload forwarded to each listener.
     */
    emit(event: string, data: unknown): void {
        this.listeners.get(event)?.forEach((listener) => {
            try {
                listener(data);
            } catch (err) {
                console.error(`EventBus error in listener for "${event}":`, err);
            }
        });
    }
}

/** Singleton event bus instance. */
export const eventBus = new EventBus();

/** Known event names used across the application. */
export const Events = {
    /** Fired when a new message is created in any channel.
     *  Payload: {@link MessageDB} */
    MessageCreated: 'message:created',
} as const;
