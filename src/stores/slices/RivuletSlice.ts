import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { type RivuletState, SpaceCreationState} from '../../models/global';
import { setCurrentChannelById } from './UserSlice';

const initialState: RivuletState = {
  creatingSpace: SpaceCreationState.NotCreatingSpace,
}

const RivuletSlice = createSlice({
    name: 'RivuletSlice',
    initialState,
    reducers: { 
        //TODO: make functions for setting creating server and channel instead of passing in the state directly
        setCreatingSpace: (state, action: PayloadAction<SpaceCreationState>) => {
            state.creatingSpace = action.payload;
        }
    },
});

export const { setCreatingSpace } = RivuletSlice.actions;
export default RivuletSlice.reducer;