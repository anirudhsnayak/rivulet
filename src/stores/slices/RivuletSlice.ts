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
        //TODO: make functions for setting creating server and channel instead of passing in the state directly
        setCreatingSpace: (state, action: PayloadAction<SpaceCreationState>) => {
            state.creatingSpace = action.payload;
        },
        setLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.loggedIn = action.payload;
        },
        setCurrentUserName: (state, action: PayloadAction<string>) => {
            state.currentUserName = action.payload;
        },
        setPendingInvite: (state, action: PayloadAction<string | null>) => {
            state.pendingInvite = action.payload;
        }
    },
});

export const { setCreatingSpace, setLoggedIn, setCurrentUserName, setPendingInvite } = RivuletSlice.actions;
export default RivuletSlice.reducer;