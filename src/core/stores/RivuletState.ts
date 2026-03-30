import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

//TODO: appLoaded is obsolete

export interface RivuletState {
  appLoaded: boolean;
  creatingServer: boolean;
}

const initialState: RivuletState = {
  appLoaded: false,
  creatingServer: false,
}

export const RivuletState = createSlice({
    name: 'RivuletState',
    initialState,
    reducers: { 
        setAppLoaded: (state, action: PayloadAction<boolean>) => {
            state.appLoaded = action.payload;
        },
        setCreatingServer: (state, action: PayloadAction<boolean>) => {
            state.creatingServer = action.payload;
        }
    },
});

export const { setAppLoaded, setCreatingServer } = RivuletState.actions;
export default RivuletState.reducer;