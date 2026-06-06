'use client';

import { LazyAdminGate } from '@/components/admin/lazy';

export function AdminCasesShell({ children }: { children: React.ReactNode }) {
  return (
    <LazyAdminGate>
      <div className="container-page section mx-auto max-w-6xl pb-16">{children}</div>
    </LazyAdminGate>
  );
}
