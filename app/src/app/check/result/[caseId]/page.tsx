import { CheckReport } from '@/components/CheckReport';
import type { Id } from 'convex/_generated/dataModel';

export default async function CheckResultPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  return <CheckReport caseId={caseId as Id<'cases'>} />;
}
