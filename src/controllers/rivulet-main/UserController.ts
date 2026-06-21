/**
 * @file User controller — processes pending invites on session restore.
 *
 * Checks for a pending invite code in Redux state and, if one exists,
 * automatically joins the referenced server. Called during the session
 * restore flow.
 *
 * @see {@link InviteReceivedModal} — the UI modal for manual accept/decline
 * @see {@link useRestoreSession} — session restoration hook
 */

import { joinServerWithInvite } from "../../api/UserModelAPI";
import { store } from "../../stores/store";
import { setPendingInvite } from "../../stores/slices/RivuletSlice";

/**
 * If a pending invite code exists in Redux state, joins the referenced
 * server and clears the invite. This is called during session restoration
 * when the user arrives via an invite link.
 */
export async function processPendingInvites() {
    const pendingInvite = store.getState().RivuletState.pendingInvite;
    if (!pendingInvite) return;
    await joinServerWithInvite(pendingInvite);
    store.dispatch(setPendingInvite(null));
}