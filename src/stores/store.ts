import { configureStore } from '@reduxjs/toolkit'
import userModelReducer from './slices/UserSlice';
import rivuletStateReducer from './slices/RivuletSlice';

export const store = configureStore({
  reducer: {
    UserModel: userModelReducer,
    RivuletState: rivuletStateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch