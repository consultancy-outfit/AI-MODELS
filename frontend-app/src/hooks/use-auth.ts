'use client';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearCredentials } from '@/store/slices/authSlice';
import { useLogoutMutation } from '@/services/authApi';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, accessToken, hasHydrated, status } = useAppSelector((s) => s.auth);
  const [logoutMutation] = useLogoutMutation();

  const logout = async () => {
    await logoutMutation();
    dispatch(clearCredentials());
  };

  return { user, isAuthenticated, accessToken, hasHydrated, status, logout };
}
