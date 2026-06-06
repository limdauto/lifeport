'use client';

import { AdminGate } from '@/components/admin/AdminGate';

export function AdminCasesShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminGate>
      <div className="container-page section mx-auto max-w-6xl pb-16">{children}</div>
    </AdminGate>
  );
}
