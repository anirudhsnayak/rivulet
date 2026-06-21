/**
 * Enum controlling which "space creation" modal is currently visible.
 *
 * Stored in {@link RivuletState.creatingSpace} and consumed by
 * {@link SpaceCreationModal | SpaceCreationModal.tsx} to determine which
 * form to display.
 *
 * | Value | Meaning |
 * |---|---|
 * | `NotCreatingSpace` | No creation modal is open. |
 * | `CreatingServer` | The "Create Server" form is displayed. |
 * | `CreatingChannel` | The "Create Channel" form is displayed. |
 *
 * @see {@link RivuletState} — Redux state slice that holds this enum
 * @see {@link docs/architecture.md#spacecreationstate-enum} — architecture docs
 */
export const enum SpaceCreationState {
  NotCreatingSpace = 0,
  CreatingServer = 1,
  CreatingChannel = 2,
}
