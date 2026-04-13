import { RivuletTextField } from "../../../components/RivuletTextField";
import { createMessage, reloadMessages } from "../../../api/MessageAPI";
import { store } from "../../../stores/store";

async function handleMessageSend(message: string) {
    let currentGuildId = store.getState().UserModel.currentGuildId;
    let currentChannelId = store.getState().UserModel.currentChannelId;
    await createMessage(currentGuildId, currentChannelId, message);
    await reloadMessages(); //TODO: this is inefficient
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