'use client';

import { useEffect } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetProfileQuery } from '@/lib/services/authApi';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { clearCredentials, hydrateAuth, setCredentials } from '@/lib/store/slices/authSlice';
import type { AuthCredentials } from '@/lib/types/auth.types';

const AUTH_STORAGE_KEY = 'nexusai_auth';

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { accessToken, hasHydrated } = useAppSelector((state) => state.auth);
  const { data: profile, error } = useGetProfileQuery(accessToken ?? skipToken);

  useEffect(() => {
    if (typeof window === 'undefined' || hasHydrated) return;

    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) {
        dispatch(hydrateAuth(null));
        return;
      }

      const parsed = JSON.parse(raw) as AuthCredentials;
      if (!parsed.user || !parsed.accessToken) {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        dispatch(hydrateAuth(null));
        return;
      }

      dispatch(hydrateAuth(parsed));
    } catch {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      dispatch(hydrateAuth(null));
    }
  }, [dispatch, hasHydrated]);

  useEffect(() => {
    if (typeof window === 'undefined' || !hasHydrated) return;

    if (accessToken && profile) {
      const payload = { accessToken, user: profile };
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
      dispatch(setCredentials(payload));
      return;
    }

    if (!accessToken) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [accessToken, dispatch, hasHydrated, profile]);

  useEffect(() => {
    if (!accessToken || !error || typeof window === 'undefined') return;
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    dispatch(clearCredentials());
  }, [accessToken, dispatch, error]);

  return <>{children}</>;
}
