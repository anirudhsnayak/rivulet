import { getInviteCode } from "../../api/ServerAPI";
import { store } from "../../stores/store";


export async function displayInviteCode() {
    const currentGuildId = store.getState().UserSlice.currentGuildId;
    const inviteCode = await getInviteCode(currentGuildId);
    console.log(inviteCode);
}