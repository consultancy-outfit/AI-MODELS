import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User, AuthCredentials } from '@/lib/types/auth.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  status: 'idle' | 'loading' | 'error';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  hasHydrated: false,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthCredentials>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.hasHydrated = true;
      state.status = 'idle';
      state.error = null;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.hasHydrated = true;
      state.status = 'idle';
    },
    hydrateAuth: (state, action: PayloadAction<AuthCredentials | null>) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      }
      state.hasHydrated = true;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setAuthStatus: (state, action: PayloadAction<AuthState['status']>) => {
      state.status = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = 'error';
    },
  },
});

export const { setCredentials, clearCredentials, hydrateAuth, setUser, setAuthStatus, setAuthError } = authSlice.actions;
export default authSlice.reducer;
export type { AuthState };
