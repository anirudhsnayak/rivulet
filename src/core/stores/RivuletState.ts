import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

//TODO: appLoaded is obsolete

export const SpaceCreationState = {
  NotCreatingSpace: 0,
  CreatingServer: 1,
  CreatingChannel: 2,
} as const;

export type SpaceCreationState = typeof SpaceCreationState[keyof typeof SpaceCreationState];

export interface RivuletState {
  appLoaded: boolean;
  creatingSpace: SpaceCreationState;
}

const initialState: RivuletState = {
  appLoaded: false,
  creatingSpace: SpaceCreationState.NotCreatingSpace,
}

export const RivuletState = createSlice({
    name: 'RivuletState',
    initialState,
    reducers: { 
        setAppLoaded: (state, action: PayloadAction<boolean>) => {
            state.appLoaded = action.payload;
        },
        setCreatingSpace: (state, action: PayloadAction<SpaceCreationState>) => {
            state.creatingSpace = action.payload;
        }
    },
});

export const { setAppLoaded, setCreatingSpace } = RivuletState.actions;
export default RivuletState.reducer;