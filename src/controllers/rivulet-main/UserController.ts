import { joinServerWithInvite } from "../../api/UserModelAPI";

export async function processPendingInvites() {
    const pendingInvite = sessionStorage.getItem('pendingInvite');
    if (!pendingInvite) return;
    await joinServerWithInvite(pendingInvite);
    sessionStorage.removeItem('pendingInvite');
}