/**
 * @file Redux slice for app-level (non-server-data) state.
 *
 * Manages authentication status, the current user's display name,
 * the server/channel creation modal state, and the pending invite flow.
 *
 * @see {@link RivuletState} — the state shape managed by this slice
 * @see {@link docs/architecture.md#rivuletstate} — architecture docs
 */

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { type RivuletState, SpaceCreationState} from '../../models/global';

const initialState: RivuletState = {
    loggedIn: false,
    currentUserName: '',
    creatingSpace: SpaceCreationState.NotCreatingSpace,
    pendingInvite: null,
}

const RivuletSlice = createSlice({
    name: 'RivuletSlice',
    initialState,
    reducers: {
        /**
         * Sets the app-level modal state for creating a server or channel.
         * Pass `NotCreatingSpace` to close any open creation modal.
         * @todo Add dedicated `setCreatingServer` / `setCreatingChannel`
         *       actions instead of passing the enum value directly.
         */
        setCreatingSpace: (state, action: PayloadAction<SpaceCreationState>) => {
            state.creatingSpace = action.payload;
        },
        /** Sets the user's authenticated session status. */
        setLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.loggedIn = action.payload;
        },
        /** Sets the display name of the currently logged-in user. */
        setCurrentUserName: (state, action: PayloadAction<string>) => {
            state.currentUserName = action.payload;
        },
        /**
         * Stores a pending invite code (from `/invite/:inviteId`) or clears it.
         * @param action.payload - The invite code string, or `null` to clear.
         */
        setPendingInvite: (state, action: PayloadAction<string | null>) => {
            state.pendingInvite = action.payload;
        }
    },
});

export const { setCreatingSpace, setLoggedIn, setCurrentUserName, setPendingInvite } = RivuletSlice.actions;
export default RivuletSlice.reducer;