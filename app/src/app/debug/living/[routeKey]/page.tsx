import { notFound } from 'next/navigation';
import { LivingReportPreview } from '@/components/debug/LivingReportPreview';
import { buildDebugLivingPayload } from '@/lib/debug/buildPayloads';
import { getRouteByKey, type RouteKey } from '@/lib/routes';

export default async function DebugLivingPage({
  params,
  searchParams,
}: {
  params: Promise<{ routeKey: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { routeKey } = await params;
  const { tab } = await searchParams;
  const route = getRouteByKey(routeKey);
  if (!route) notFound();

  const payload = buildDebugLivingPayload(routeKey as RouteKey);
  if (!payload) notFound();

  const initialTab =
    tab === 'inputs' || tab === 'packages' || tab === 'report' ? tab : 'report';

  return (
    <LivingReportPreview
      routeKey={routeKey as RouteKey}
      initialTab={initialTab}
      payload={payload}
    />
  );
}
