import { LivingReport } from '@/components/LivingReport';
import type { Id } from 'convex/_generated/dataModel';

export default async function ReportInputsPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  return <LivingReport caseId={caseId as Id<'cases'>} initialTab="inputs" />;
}
