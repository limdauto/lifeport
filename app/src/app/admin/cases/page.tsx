import { Suspense } from 'react';
import { AdminCaseList } from '@/components/admin/AdminCaseList';

export default function AdminCasesPage() {
  return (
    <Suspense fallback={<p className="text-on-surface-variant">Loading cases…</p>}>
      <AdminCaseList />
    </Suspense>
  );
}
