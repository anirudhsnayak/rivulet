import { SpaceCreationState } from "./SpaceCreationState";

export interface RivuletState {
    loggedIn: boolean;
    currentUserName: string;
    creatingSpace: SpaceCreationState;
    pendingInvite: string | null;
}