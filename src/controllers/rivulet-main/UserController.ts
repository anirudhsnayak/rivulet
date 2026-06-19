import { joinServerWithInvite } from "../../api/UserModelAPI";
import { store } from "../../stores/store";
import { setPendingInvite } from "../../stores/slices/RivuletSlice";

export async function processPendingInvites() {
    const pendingInvite = store.getState().RivuletState.pendingInvite;
    if (!pendingInvite) return;
    await joinServerWithInvite(pendingInvite);
    store.dispatch(setPendingInvite(null));
}