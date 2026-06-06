import { AdminCaseDetail } from '@/components/admin/AdminCaseDetail';
import type { Id } from 'convex/_generated/dataModel';

export default async function AdminCasePage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  return <AdminCaseDetail caseId={caseId as Id<'cases'>} />;
}
