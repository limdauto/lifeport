'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import type { Id } from 'convex/_generated/dataModel';
import { Markdown } from '@/components/Markdown';
import { RiskBadge } from '@/components/RiskBadge';
import { Button } from '@/components/marketing/Button';
import {
  CHECK_SECTION_COUNT,
  CHECK_SECTION_PLACEHOLDERS,
  checkProgressMessage,
} from '@/lib/check';
import {
  FREE_PRODUCT_NAME,
  LIVING_CTA,
  LIVING_REPORT_PITCH,
  PAID_PRODUCT_NAME,
} from '@/lib/copy';
import { useEffect, useState } from 'react';

const CHECK_SUBTITLE = 'A first look at the areas your move may affect.';

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

  return (
    <div className="container-page section mx-auto max-w-3xl">
      {isGenerating && (
        <GeneratingBanner
          name={caseDoc.name}
          origin={caseDoc.originCountry}
          destination={caseDoc.destinationCountry}
          routeTitle={route?.title}
          completedCount={sections.length}
        />
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Your {FREE_PRODUCT_NAME}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-on-surface">{report.title}</h1>
          <p className="mt-2 text-on-surface-variant">
            {isGenerating ? 'Building your personalised check…' : CHECK_SUBTITLE}
          </p>
          {report.summary && !isGenerating && (
            <p className="mt-3 text-on-surface-variant">{report.summary}</p>
          )}
        </div>
        {!isGenerating && caseDoc.paymentStatus === 'unpaid' && route && (
          <Button href={`/checkout?caseId=${caseId}`}>{LIVING_CTA}</Button>
        )}
        {!isGenerating && caseDoc.paymentStatus === 'paid' && (
          <Button href={`/report/${caseId}`}>Open Living Report</Button>
        )}
      </div>

      <div className="mt-10 space-y-6">
        {sections.map((section) => (
          <article
            key={section._id}
            className={`rounded-xl border p-6 ${
              section.isPremiumLocked
                ? 'border-primary/30 bg-primary-fixed/20'
                : 'border-outline-variant/50 bg-surface-container-lowest'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-semibold text-on-surface">{section.title}</h2>
              <div className="flex items-center gap-2">
                <RiskBadge level={section.riskLevel} />
                {section.isPremiumLocked && (
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-on-primary">
                    Premium
                  </span>
                )}
              </div>
            </div>
            <div className="mt-4">
              {section.isPremiumLocked ? (
                <p className="text-on-surface-variant">
                  Unlock your {PAID_PRODUCT_NAME} to see full analysis for this section.
                </p>
              ) : (
                <Markdown content={section.contentMarkdown} />
              )}
            </div>
          </article>
        ))}

        {isGenerating &&
          pendingPlaceholders.map((placeholder) => (
            <SectionSkeleton key={placeholder.sectionKey} title={placeholder.title} />
          ))}
      </div>

      {!isGenerating && packages.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-on-surface">Setup packages to consider</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="rounded-xl border border-outline-variant/50 bg-surface-container-low p-5"
              >
                <h3 className="font-semibold text-on-surface">{pkg.title}</h3>
                <p className="mt-2 text-sm text-on-surface-variant">{pkg.reason}</p>
                {pkg.priceFrom != null && (
                  <p className="mt-3 text-sm font-semibold text-primary">From £{pkg.priceFrom}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {!isGenerating && (
        <section
          id="upgrade"
          className="mt-12 rounded-2xl border border-primary/30 bg-primary-container p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-on-primary-container">
            Unlock your {PAID_PRODUCT_NAME}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-on-primary-container/90">
            {LIVING_REPORT_PITCH}
          </p>
          {route && (
            <p className="mt-2 text-sm font-semibold text-on-primary-container">
              From £{route.livingPriceGbp} for {route.title}
            </p>
          )}
        <div className="mt-6">
          <Button variant="secondary" href={`/checkout?caseId=${caseId}`}>
            {LIVING_CTA}
          </Button>
        </div>
        </section>
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
    <div className="mb-8 rounded-xl border border-primary/20 bg-primary-fixed/30 p-5">
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

function SectionSkeleton({ title }: { title: string }) {
  return (
    <article className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest/60 p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-on-surface/40">{title}</h2>
        <div className="h-5 w-16 animate-pulse rounded-full bg-outline-variant/30" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full animate-pulse rounded bg-outline-variant/25" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-outline-variant/20" />
        <div className="h-3 w-4/6 animate-pulse rounded bg-outline-variant/15" />
      </div>
    </article>
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
