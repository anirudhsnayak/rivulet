import { configureStore } from '@reduxjs/toolkit'
import userModelReducer from '../core/stores/UserModel';
import rivuletStateReducer from '../core/stores/RivuletState';

export const store = configureStore({
  reducer: {
    UserModel: userModelReducer,
    RivuletState: rivuletStateReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch