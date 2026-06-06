import { LivingReport } from '@/components/LivingReport';
import type { Id } from 'convex/_generated/dataModel';

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ caseId: string }>;
  searchParams: Promise<{ tab?: string; paid?: string }>;
}) {
  const { caseId } = await params;
  const { tab, paid } = await searchParams;
  const initialTab =
    tab === 'inputs' || tab === 'packages' || tab === 'report' ? tab : 'report';

  return (
    <LivingReport
      caseId={caseId as Id<'cases'>}
      initialTab={initialTab}
      justPaid={paid === '1'}
    />
  );
}
