/**
 * @file Invite landing page — handles invite code from URL.
 *
 * Rendered at `/invite/:inviteId`. Stores the invite code in Redux and
 * immediately redirects: logged-in users go to `/app`, others go to `/login`
 * where they'll process the invite after authenticating.
 *
 * @see {@link InviteReceivedModal} — modal that handles accept/decline after login
 * @see {@link docs/architecture.md#receiving-an-invite} — invite flow docs
 */

import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../stores/store";
import { setPendingInvite } from "../../stores/slices/RivuletSlice";

/**
 * Invite landing component.
 *
 * Reads `inviteId` from the URL params, dispatches it to the Redux store
 * via {@link setPendingInvite}, then redirects to `/app` or `/login`
 * depending on authentication status.
 *
 * Renders nothing (returns `null`) — it is a logic-only route handler.
 */
export function Invite() {
    const { inviteId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state: RootState) => state.RivuletState.loggedIn);

    useEffect(() => {
        if (inviteId) {
            dispatch(setPendingInvite(inviteId));
        }
        if (isLoggedIn) {
            navigate('/app');
        } else {
            navigate('/login');
        }
    }, [inviteId, isLoggedIn, dispatch, navigate]);

    return null;
}