import { SpaceCreationState } from "./SpaceCreationState";

export interface RivuletState {
    loggedIn: boolean;
    creatingSpace: SpaceCreationState;
}