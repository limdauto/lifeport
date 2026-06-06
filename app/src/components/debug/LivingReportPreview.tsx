'use client';

import { useEffect, useState } from 'react';
import { DebugBanner } from '@/components/debug/DebugBanner';
import { LivingReportWorkspace } from '@/components/LivingReport';
import { DEBUG_CASE_ID } from '@/lib/debug/buildPayloads';
import type { RouteKey } from '@/lib/routes';

type Tab = 'report' | 'inputs' | 'packages';

export function LivingReportPreview({
  routeKey,
  initialTab = 'report',
  payload,
}: {
  routeKey: RouteKey;
  initialTab?: Tab;
  payload: NonNullable<ReturnType<typeof import('@/lib/debug/buildPayloads').buildDebugLivingPayload>>;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  return (
    <>
      <DebugBanner label={`Lifeport Plan · ${payload.route.title}`} />
      <LivingReportWorkspace
        caseId={DEBUG_CASE_ID}
        debugRouteKey={routeKey}
        tab={tab}
        setTab={setTab}
        caseDoc={payload.case}
        route={payload.route}
        report={payload.report}
        sections={payload.sections}
        packages={payload.packages}
        versions={payload.versions}
        latestJob={payload.latestJob}
        profile={payload.profile}
        isGenerating={false}
        pendingAffected={payload.pendingAffectedSections}
      />
    </>
  );
}
