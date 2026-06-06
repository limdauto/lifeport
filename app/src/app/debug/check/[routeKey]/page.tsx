import { notFound } from 'next/navigation';
import { CheckReportPreview } from '@/components/debug/CheckReportPreview';
import { buildDebugCheckPayload } from '@/lib/debug/buildPayloads';
import { getRouteByKey, type RouteKey } from '@/lib/routes';

export default async function DebugCheckPage({
  params,
}: {
  params: Promise<{ routeKey: string }>;
}) {
  const { routeKey } = await params;
  const route = getRouteByKey(routeKey);
  if (!route) notFound();

  const payload = buildDebugCheckPayload(routeKey as RouteKey);
  if (!payload) notFound();

  return (
    <CheckReportPreview
      route={payload.route}
      report={payload.report}
      sections={payload.sections}
      packages={payload.packages}
      caseName={payload.case.name}
    />
  );
}
