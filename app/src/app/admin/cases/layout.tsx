import { AdminCasesShell } from '@/components/admin/AdminCasesShell';

export const dynamic = 'force-dynamic';

export default function AdminCasesLayout({ children }: { children: React.ReactNode }) {
  return <AdminCasesShell>{children}</AdminCasesShell>;
}
