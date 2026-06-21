/**
 * Redux state slice for app-level (non-server-data) state.
 *
 * Tracks authentication status, the current user's display name,
 * modal visibility for server/channel creation, and any pending
 * invite flow state.
 *
 * @see {@link RivuletSlice} — Redux slice that manages this state
 * @see {@link SpaceCreationState} — enum controlling creation modals
 * @see {@link docs/architecture.md#rivuletstate} — architecture docs
 */
import { SpaceCreationState } from "./SpaceCreationState";

export interface RivuletState {
    /** Whether the user has an active session. */
    loggedIn: boolean;
    /** Display name of the currently logged-in user (empty string if not logged in). */
    currentUserName: string;
    /** Controls visibility of the server/channel creation modal. */
    creatingSpace: SpaceCreationState;
    /** Pending invite code from the `/invite/:inviteId` route, or `null`. */
    pendingInvite: string | null;
}