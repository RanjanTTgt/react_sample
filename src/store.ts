import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist'
import type { AnyAction } from 'redux';
import authReducer from './slices/auth';
import alertReducer from './slices/alerts';
import dialogReducer from './slices/dialog';
import animationReducer from './slices/animation';
import localStorage from "redux-persist/es/storage";

const persistConfig = {
  key: 'root',
  storage: localStorage,
  whitelist: ["auth"],
};

const appReducer = combineReducers({
  auth: authReducer,
  alerts: alertReducer,
  dialog: dialogReducer,
  animation: animationReducer,
})

const rootReducer = (state: any, action: AnyAction) => {
  if (action.type === 'auth/logout') {
    // for all keys defined in your persistConfig(s)
    localStorage.removeItem('persist:root');

    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
