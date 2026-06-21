/**
 * @file Barrel exports for global (app-level) Redux state models.
 *
 * Aggregates the two Redux state slice types and the {@link SpaceCreationState}
 * enum used throughout the application.
 *
 * @see {@link UserSlice} — Redux slice for `UserState`
 * @see {@link RivuletSlice} — Redux slice for `RivuletState`
 * @see {@link docs/architecture.md#redux-store-structure} — store structure docs
 */

export { SpaceCreationState } from './SpaceCreationState';
export type { RivuletState } from './RivuletState';
export type { UserState } from './UserState';