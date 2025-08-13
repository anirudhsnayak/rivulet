import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface RivuletState {
  appLoaded: boolean;
}

const initialState: RivuletState = {
  appLoaded: false,
}

export const RivuletState = createSlice({
    name: 'RivuletState',
    initialState,
    reducers: {
        setAppLoaded: (state, action: PayloadAction<boolean>) => {
            state.appLoaded = action.payload;
        },
    },
});

export const { setAppLoaded } = RivuletState.actions;
export default RivuletState.reducer;