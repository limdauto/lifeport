import { AdminCasesShell } from '@/components/admin/AdminCasesShell';

export default function AdminCasesLayout({ children }: { children: React.ReactNode }) {
  return <AdminCasesShell>{children}</AdminCasesShell>;
}
