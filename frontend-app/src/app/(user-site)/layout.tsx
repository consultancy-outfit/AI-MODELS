import { MainLayout } from '@/layouts/main';

export default function UserSiteLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
