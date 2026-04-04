import { GuestGuard } from '@/guards/guest-guard';
import { AuthLayout } from '@/layouts/auth';

export default function AuthRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuestGuard>
      <AuthLayout>{children}</AuthLayout>
    </GuestGuard>
  );
}
