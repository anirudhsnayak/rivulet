/**
 * @file Redux store configuration.
 *
 * Configures a single store with two slices — `UserSlice` for server data
 * (guilds, channels, messages, members) and `RivuletState` for app-level
 * state (auth, modals, invites).
 *
 * Exports the {@link store} singleton as well as convenience types
 * {@link RootState} and {@link AppDispatch} for typed selectors and dispatch.
 *
 * @see {@link UserSlice} — user/server data slice
 * @see {@link RivuletSlice} — app-level state slice
 * @see {@link docs/architecture.md#redux-store-structure} — store structure docs
 */

import { configureStore } from '@reduxjs/toolkit'
import userSliceReducer from './slices/UserSlice';
import rivuletStateReducer from './slices/RivuletSlice';

/**
 * The single Redux store for the application.
 *
 * Combines two reducers:
 * - `UserSlice` — guilds, channels, messages, members + current selections
 * - `RivuletState` — loggedIn, currentUserName, creatingSpace, pendingInvite
 */
export const store = configureStore({
  reducer: {
    UserSlice: userSliceReducer,
    RivuletState: rivuletStateReducer,
  },
});

/** Inferred type of the entire Redux state tree. */
export type RootState = ReturnType<typeof store.getState>
/** Inferred dispatched action type for `useDispatch<AppDispatch>()`. */
export type AppDispatch = typeof store.dispatch