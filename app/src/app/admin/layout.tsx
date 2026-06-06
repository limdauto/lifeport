import { AdminChrome } from '@/components/admin/AdminChrome';

export const metadata = {
  title: 'Lifeport Admin',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminChrome>{children}</AdminChrome>;
}
