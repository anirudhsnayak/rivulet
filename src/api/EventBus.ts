type Listener = (data: unknown) => void;

class EventBus {
    private listeners = new Map<string, Set<Listener>>();

    on(event: string, listener: Listener): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(listener);
        return () => this.off(event, listener);
    }

    off(event: string, listener: Listener): void {
        this.listeners.get(event)?.delete(listener);
    }

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

export const eventBus = new EventBus();

export const Events = {
    MessageCreated: 'message:created',
} as const;
