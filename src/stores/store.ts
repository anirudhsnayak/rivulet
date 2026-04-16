import { configureStore } from '@reduxjs/toolkit'
import userSliceReducer from './slices/UserSlice';
import rivuletStateReducer from './slices/RivuletSlice';

export const store = configureStore({
  reducer: {
    UserSlice: userSliceReducer,
    RivuletState: rivuletStateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch