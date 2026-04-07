import { RivuletTextField } from "../../components/RivuletTextField";
import { createMessage } from "../server-api/MessageAPI";
import { store } from "../stores/store";

function handleMessageSend(message: string) {
    let currentGuildId = store.getState().UserModel.currentGuildId;
    let currentChannelId = store.getState().UserModel.currentChannelId;
    createMessage(currentGuildId, currentChannelId, message);
}

//we're using MUI here
export function MessageField() {
    return (
        <div>
            <RivuletTextField label="Type a message..." onKeyPress={(e: any) => {
                if (e.key === 'Enter') {
                    handleMessageSend(e.target.value);
                }
            }} />
        </div>
    )
}