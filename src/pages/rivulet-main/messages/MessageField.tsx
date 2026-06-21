/**
 * @file Message input field — the text input at the bottom of the message area.
 *
 * Captures keyboard input and sends messages via {@link createMessage}
 * on the Enter key. Messages are dispatched through the API layer which
 * handles both in-memory and PostgreSQL backends.
 *
 * @todo Lift message state up for cleaner code (currently reads store directly).
 *
 * @see {@link createMessage} — API function for message creation
 * @see {@link useMessageStream} — SSE hook for receiving live messages
 * @see {@link docs/architecture.md#message-sending-flow} — message flow docs
 */

import { RivuletTextField } from "../../../components/RivuletTextField";
import { createMessage } from "../../../api/MessageAPI";
import { store } from "../../../stores/store";
import { useState } from "react";


/**
 * Reads the current guild and channel from the store and sends a message.
 *
 * @param message - The text content to send.
 */
//TODO: lift up state here for cleaner code
async function handleMessageSend(message: string) {
    let currentGuildId = store.getState().UserSlice.currentGuildId;
    let currentChannelId = store.getState().UserSlice.currentChannelId;
    await createMessage(currentGuildId, currentChannelId, message);
}

/**
 * Message input field — a single-line text input that sends on Enter.
 *
 * Maintains its own local `message` state and clears it after a successful send.
 * The input uses the shared {@link RivuletTextField} component styled for the
 * message area.
 */
export function MessageField() {
    const [message, setMessage] = useState("");

    async function keyPressHandler(e: any) {
        if (e.key !== 'Enter') return;
        await handleMessageSend(e.target.value);
        setMessage("");
    }

    return (
        <>
            <RivuletTextField
                value={message}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                label="Type a message..."
                onKeyPress={keyPressHandler}
                sx={{ marginTop: '8px' }} />
        </>
    )
}