'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import type { Id } from 'convex/_generated/dataModel';
import { ReportPageHeader } from '@/components/report/ReportPageHeader';
import { ReportReader, ReportSectionSkeleton } from '@/components/report/ReportReader';
import { Button } from '@/components/marketing/Button';
import {
  CHECK_SECTION_COUNT,
  CHECK_SECTION_PLACEHOLDERS,
  checkProgressMessage,
} from '@/lib/check';
import {
  FREE_PRODUCT_NAME,
  LIVING_CTA,
  PAID_PRODUCT_NAME,
} from '@/lib/copy';
import { useEffect, useState } from 'react';

const CHECK_SUBTITLE =
  'A comprehensive first look at the key regulatory, financial, and logistical areas your move will affect.';

export function CheckReport({ caseId }: { caseId: Id<'cases'> }) {
  const data = useQuery(api.reports.getCheck, { caseId });
  const retryGeneration = useMutation(api.intake.retryCheckGeneration);
  const [retrying, setRetrying] = useState(false);

  if (data === undefined) {
    return <LoadingState message={`Loading your ${FREE_PRODUCT_NAME}…`} />;
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center text-on-surface-variant">
        Lifeport Check not found. Start a new check from a route page.
      </div>
    );
  }

  const { report, sections, packages, route, case: caseDoc, latestJob } = data;
  const isGenerating = report.status === 'generating';
  const isFailed =
    latestJob?.status === 'failed' ||
    report.status === 'failed' ||
    report.status === 'needs_review' ||
    (isGenerating && latestJob && Date.now() - latestJob.updatedAt > 60_000);

  if (isFailed && sections.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-on-surface">Check didn&apos;t complete</h1>
        <p className="mt-3 text-on-surface-variant">
          {latestJob?.error ??
            'The check may not have run. Make sure Convex is running (`npm run dev` in app/).'}
        </p>
        <Button
          className="mt-6"
          disabled={retrying}
          onClick={async () => {
            setRetrying(true);
            try {
              await retryGeneration({ caseId });
            } finally {
              setRetrying(false);
            }
          }}
        >
          {retrying ? 'Retrying…' : 'Retry check'}
        </Button>
      </div>
    );
  }

  if (isGenerating && sections.length === 0) {
    return (
      <GeneratingState
        name={caseDoc.name}
        origin={caseDoc.originCountry}
        destination={caseDoc.destinationCountry}
        routeTitle={route?.title}
        step={0}
      />
    );
  }

  const completedKeys = new Set(sections.map((s) => s.sectionKey));
  const pendingPlaceholders = CHECK_SECTION_PLACEHOLDERS.filter(
    (p) => !completedKeys.has(p.sectionKey),
  );

  const sectionData = sections.map((section) => ({
    id: section._id,
    sectionKey: section.sectionKey,
    title: section.title,
    contentMarkdown: section.contentMarkdown,
    riskLevel: section.riskLevel,
    isPremiumLocked: section.isPremiumLocked,
    lockedMessage: section.isPremiumLocked
      ? `Unlock your ${PAID_PRODUCT_NAME} to see full analysis for this section.`
      : undefined,
  }));

  const headerAction =
    !isGenerating && caseDoc.paymentStatus === 'paid' ? (
      <Button href={`/report/${caseId}`}>Open Lifeport Plan</Button>
    ) : !isGenerating && route ? (
      <Button href={`/checkout?caseId=${caseId}`}>{LIVING_CTA}</Button>
    ) : undefined;

  return (
    <div className="-mx-[var(--spacing-gutter,1.5rem)] sm:mx-0">
      {isGenerating && (
        <div className="container-page mx-auto max-w-[1200px] pt-6">
          <GeneratingBanner
            name={caseDoc.name}
            origin={caseDoc.originCountry}
            destination={caseDoc.destinationCountry}
            routeTitle={route?.title}
            completedCount={sections.length}
          />
        </div>
      )}

      <ReportPageHeader
        breadcrumb={['Reports', `Your ${FREE_PRODUCT_NAME}`]}
        title={report.title}
        description={isGenerating ? 'Building your personalised check…' : CHECK_SUBTITLE}
        sectionCount={isGenerating ? undefined : sections.length}
        action={headerAction}
      />

      <ReportReader
        sections={sectionData}
        layout="editorial"
        sidebarPlaceholders={CHECK_SECTION_PLACEHOLDERS}
        packages={!isGenerating ? packages : undefined}
        progressIndex={isGenerating ? sections.length : undefined}
        progressTotal={isGenerating ? CHECK_SECTION_COUNT : undefined}
        premiumCta={
          !isGenerating && route && caseDoc.paymentStatus !== 'paid'
            ? {
                href: `/checkout?caseId=${caseId}`,
                label: LIVING_CTA,
                priceLabel: `From £${route.livingPriceGbp} for ${route.title}`,
              }
            : undefined
        }
      />

      {isGenerating && (
        <div className="mx-auto max-w-[1200px] space-y-4 px-6 pb-12">
          {pendingPlaceholders.map((placeholder) => (
            <ReportSectionSkeleton key={placeholder.sectionKey} title={placeholder.title} />
          ))}
        </div>
      )}
    </div>
  );
}

function GeneratingBanner({
  name,
  origin,
  destination,
  routeTitle,
  completedCount,
}: {
  name: string;
  origin: string;
  destination: string;
  routeTitle?: string;
  completedCount: number;
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2800);
    return () => clearInterval(id);
  }, []);

  const message = checkProgressMessage(completedCount + (tick % 2), {
    name,
    origin,
    destination,
    routeTitle,
  });

  const progress = Math.round((completedCount / CHECK_SECTION_COUNT) * 100);

  return (
    <div className="report-soft-shadow mb-6 rounded-xl border border-primary/20 bg-primary-fixed/30 p-5">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-on-surface">{message}</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            {completedCount} of {CHECK_SECTION_COUNT} areas reviewed
          </p>
        </div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-outline-variant/30">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
          style={{ width: `${Math.max(progress, 8)}%` }}
        />
      </div>
    </div>
  );
}

function GeneratingState({
  name,
  origin,
  destination,
  routeTitle,
  step,
}: {
  name: string;
  origin: string;
  destination: string;
  routeTitle?: string;
  step: number;
}) {
  const [activeStep, setActiveStep] = useState(step);

  useEffect(() => {
    const id = setInterval(() => setActiveStep((s) => Math.min(s + 1, CHECK_SECTION_COUNT - 1)), 2800);
    return () => clearInterval(id);
  }, []);

  const message = checkProgressMessage(activeStep, { name, origin, destination, routeTitle });

  return (
    <LoadingState
      message={message}
      subtitle="Lifeport is reviewing your answers against this route — usually under a minute."
    />
  );
}

function LoadingState({ message, subtitle }: { message: string; subtitle?: string }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      <p className="mt-6 text-lg font-semibold text-on-surface">{message}</p>
      {subtitle && <p className="mt-2 text-sm text-on-surface-variant">{subtitle}</p>}
      <p className="mt-4 text-xs text-outline">
        Your check updates automatically — no refresh needed.
      </p>
    </div>
  );
}
