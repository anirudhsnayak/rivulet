import { RivuletTextField } from "../../../components/RivuletTextField";
import { createMessage, reloadMessages } from "../../../api/MessageAPI";
import { store } from "../../../stores/store";
import { useState } from "react";


//TODO: lift up state here for cleaner code
async function handleMessageSend(message: string) {
    let currentGuildId = store.getState().UserSlice.currentGuildId;
    let currentChannelId = store.getState().UserSlice.currentChannelId;
    await createMessage(currentGuildId, currentChannelId, message);
    await reloadMessages(); //TODO: this is inefficient
}

export function MessageField() {
    const [message, setMessage] = useState("");

    async function keyPressHandler(e: any) {
        if (e.key !== 'Enter') return;
        await handleMessageSend(e.target.value);
        setMessage("");
    }

    return (
        <div>
            <RivuletTextField 
                value={message}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                label="Type a message..." 
                onKeyPress={keyPressHandler} />
        </div>
    )
}