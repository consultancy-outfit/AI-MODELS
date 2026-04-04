'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { paths } from '@/constants/routes';
import type { GuardProps } from './guards.interface';

export function AuthGuard({ children }: GuardProps) {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace(paths.auth.login);
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated || !isAuthenticated) return null;
  return <>{children}</>;
}
