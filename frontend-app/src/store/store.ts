import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import uiReducer from './slices/uiSlice';
import agentReducer from './slices/agentSlice';
import { baseApi } from '@/services/baseApi';
import { authApi } from '@/services/authApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    ui: uiReducer,
    agent: agentReducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
