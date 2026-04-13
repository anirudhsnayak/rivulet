import { configureStore } from '@reduxjs/toolkit'
import userModelReducer from './states/UserState';
import rivuletStateReducer from './states/RivuletState';

export const store = configureStore({
  reducer: {
    UserModel: userModelReducer,
    RivuletState: rivuletStateReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch