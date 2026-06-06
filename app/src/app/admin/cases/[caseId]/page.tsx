import { LazyAdminCaseDetail } from '@/components/admin/lazy';
import type { Id } from 'convex/_generated/dataModel';

export default async function AdminCasePage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  return <LazyAdminCaseDetail caseId={caseId as Id<'cases'>} />;
}
