import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export const SpaceCreationState = {
  NotCreatingSpace: 0,
  CreatingServer: 1,
  CreatingChannel: 2,
} as const;

export type SpaceCreationState = typeof SpaceCreationState[keyof typeof SpaceCreationState];

export interface RivuletState {
  creatingSpace: SpaceCreationState;
}

const initialState: RivuletState = {
  creatingSpace: SpaceCreationState.NotCreatingSpace,
}

export const RivuletState = createSlice({
    name: 'RivuletState',
    initialState,
    reducers: { 
        //TODO: make functions for setting creating server and channel instead of passing in the state directly
        setCreatingSpace: (state, action: PayloadAction<SpaceCreationState>) => {
            state.creatingSpace = action.payload;
        }
    },
});

export const { setCreatingSpace } = RivuletState.actions;
export default RivuletState.reducer;