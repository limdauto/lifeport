'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import type { Id } from 'convex/_generated/dataModel';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { livingProgressMessage } from '@/lib/living';
import { ReportPackageGrid } from '@/components/report/ReportPackageGrid';
import { ReportPageHeader } from '@/components/report/ReportPageHeader';
import { ReportReader, ReportSectionSkeleton } from '@/components/report/ReportReader';
import { Button } from '@/components/marketing/Button';
import { LivingGroupWizard } from '@/components/LivingGroupWizard';
import { MoveRiskScoreBadge } from '@/components/report/MoveRiskScoreBadge';
import {
  groupLivingFields,
  inputsFieldsGrouped,
  inputsFieldsForRoute,
  livingIntakeFields,
} from '@/lib/fieldDefs';
import { computeRiskScore } from '@/lib/riskScore';
import { sectionTitle } from '@/lib/sectionTitles';
import { isDebugCaseId } from '@/lib/debug/buildPayloads';
import { debugCheckPath, debugLivingPath } from '@/lib/debug/paths';
import { FREE_PRODUCT_NAME, LIVING_CTA, PAID_PRODUCT_NAME } from '@/lib/copy';
import type { RouteKey } from '@/lib/routes';

type Tab = 'report' | 'inputs' | 'packages';

export function LivingReport({
  caseId,
  initialTab = 'report',
  justPaid,
}: {
  caseId: Id<'cases'>;
  initialTab?: Tab;
  justPaid?: boolean;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const debugStubCase = isDebugCaseId(caseId);
  const data = useQuery(
    api.reports.getLivingReport,
    debugStubCase ? 'skip' : { caseId },
  );

  if (debugStubCase) {
    return (
      <Shell
        message="This preview uses stub data — open it from the debug hub."
        action={<Button href="/debug">Open debug previews</Button>}
      />
    );
  }

  if (data === undefined) {
    return <Shell message={`Loading your ${PAID_PRODUCT_NAME}…`} />;
  }

  if (!data) {
    return <Shell message="Report not found." />;
  }

  const { case: caseDoc, route, report, sections, packages, versions, latestJob, profile } =
    data;

  if (caseDoc.paymentStatus !== 'paid') {
    return (
      <Shell
        message={`Unlock your ${PAID_PRODUCT_NAME} to continue.`}
        action={<Button href={`/checkout?caseId=${caseId}`}>{LIVING_CTA}</Button>}
      />
    );
  }

  const needsIntake = !report && caseDoc.status === 'living_intake_started';
  const isGenerating = report?.status === 'generating';
  const awaitingReview = data.awaitingReview ?? false;
  const pendingAffected = data.pendingAffectedSections ?? [];

  if (needsIntake || (justPaid && !report)) {
    return (
      <LivingIntakePanel
        caseId={caseId}
        routeTitle={route?.title ?? 'your route'}
        routeFieldKeys={route?.livingReportFields ?? []}
        existingAnswers={(profile?.rawAnswers as Record<string, string>) ?? {}}
      />
    );
  }

  if (awaitingReview && !isGenerating) {
    return (
      <Shell
        message="Your Lifeport Plan is ready — expert review in progress"
        subtitle={`We're reviewing your ${route?.title ?? 'route'} report before delivery. You'll see the full report here once published — usually within one working day.`}
        action={
          <p className="text-sm text-on-surface-variant">
            Questions? Reply to your Lifeport Check email or contact support.
          </p>
        }
      />
    );
  }

  return (
    <LivingReportWorkspace
      caseId={caseId}
      tab={tab}
      setTab={setTab}
      caseDoc={caseDoc}
      route={route}
      report={report}
      sections={sections}
      packages={packages}
      versions={versions}
      latestJob={latestJob}
      profile={profile}
      isGenerating={!!isGenerating}
      pendingAffected={pendingAffected}
    />
  );
}

export function LivingReportWorkspace({
  caseId,
  debugRouteKey,
  tab,
  setTab,
  caseDoc,
  route,
  report,
  sections,
  packages,
  versions,
  latestJob,
  profile,
  isGenerating,
  pendingAffected,
}: {
  caseId: Id<'cases'>;
  /** When set, tab links stay on /debug/living and mutations are disabled. */
  debugRouteKey?: RouteKey;
  tab: Tab;
  setTab: (tab: Tab) => void;
  caseDoc: { name: string };
  route?: {
    title?: string;
    checkFields?: string[];
    livingReportFields?: string[];
    reportSections?: string[];
    riskScoring?: import('@/lib/riskScore').RouteRiskScoringConfig;
  } | null;
  report?: { title?: string; status?: string; summary?: string } | null;
  sections: Array<{
    _id: string;
    sectionKey: string;
    title: string;
    contentMarkdown: string;
    riskLevel?: string;
  }>;
  packages: Array<{
    _id: string;
    packageKey: string;
    title: string;
    reason: string;
    outcome?: string;
    priceFrom?: number;
    status: string;
  }>;
  versions: Array<{ changeSummary: string; createdAt: number }>;
  latestJob?: { status: string; error?: string } | null;
  profile?: {
    version?: number;
    rawAnswers?: Record<string, string>;
    pendingChangeSummary?: string;
  } | null;
  isGenerating: boolean;
  pendingAffected: string[];
}) {
  const isDebug = !!debugRouteKey;
  const reportTitle = report?.title ?? `Lifeport Plan — ${route?.title}`;
  const routeLine = `${route?.title ?? 'Your route'} · Profile v${profile?.version ?? 1}`;
  const tabHref = (id: Tab) =>
    isDebug && debugRouteKey ? debugLivingPath(debugRouteKey, id) : `/report/${caseId}${id === 'report' ? '' : `/${id}`}`;
  const checkLink = (
    <Link
      href={isDebug && debugRouteKey ? debugCheckPath(debugRouteKey) : `/check/result/${caseId}`}
      className="rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-5 py-2.5 text-label-md font-semibold text-primary transition-colors hover:bg-surface-container-low"
    >
      View {FREE_PRODUCT_NAME}
    </Link>
  );

  const savedAnswers = (profile?.rawAnswers as Record<string, string>) ?? {};
  const checkFieldKeys = route?.checkFields ?? [];
  const livingFieldKeys = route?.livingReportFields ?? [];
  const riskFields = useMemo(
    () => inputsFieldsForRoute(checkFieldKeys, livingFieldKeys),
    [checkFieldKeys, livingFieldKeys],
  );
  const [liveAnswers, setLiveAnswers] = useState(savedAnswers);
  const riskResult = useMemo(
    () => computeRiskScore(liveAnswers, riskFields, route?.riskScoring),
    [liveAnswers, riskFields, route?.riskScoring],
  );

  useEffect(() => {
    setLiveAnswers((profile?.rawAnswers as Record<string, string>) ?? {});
  }, [profile?.version]);

  useEffect(() => {
    if (tab !== 'inputs') {
      setLiveAnswers((profile?.rawAnswers as Record<string, string>) ?? {});
    }
  }, [tab, profile?.rawAnswers]);

  const headerByTab = {
    report: {
      breadcrumb: ['Reports', PAID_PRODUCT_NAME],
      title: reportTitle,
      description: routeLine,
      sectionCount:
        report?.status === 'ready' || report?.status === 'published' ? sections.length : undefined,
    },
    inputs: {
      breadcrumb: ['Reports', PAID_PRODUCT_NAME, 'Inputs'],
      title: 'Move profile',
      description: 'Update your move facts — saved changes refresh affected report sections.',
    },
    packages: {
      breadcrumb: ['Reports', PAID_PRODUCT_NAME, 'Packages'],
      title: 'Setup packages',
      description: 'Hands-on help for attestation, banking, housing, arrival day, and more.',
      meta:
        packages.length > 0
          ? {
              icon: 'inventory_2',
              label: `${packages.length} package${packages.length === 1 ? '' : 's'} recommended`,
            }
          : undefined,
    },
  } as const;

  const header = headerByTab[tab];

  return (
    <div className="-mx-[var(--spacing-gutter,1.5rem)] sm:mx-0">
      <ReportPageHeader
        breadcrumb={[...header.breadcrumb]}
        title={header.title}
        description={header.description}
        sectionCount={'sectionCount' in header ? header.sectionCount : undefined}
        meta={'meta' in header ? header.meta : undefined}
        action={checkLink}
      />

      <div className="sticky top-0 z-30 border-b border-outline-variant/30 bg-surface-container-lowest/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 py-3">
          <nav className="flex gap-1">
            {(
              [
                { id: 'report' as Tab, label: 'Report' },
                { id: 'inputs' as Tab, label: 'Inputs' },
                { id: 'packages' as Tab, label: 'Packages' },
              ] as const
            ).map((item) =>
              isDebug ? (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`rounded-lg px-5 py-2.5 text-label-md font-semibold transition-colors ${
                    tab === item.id
                      ? 'bg-surface-container text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.id}
                  href={tabHref(item.id)}
                  onClick={() => setTab(item.id)}
                  className={`rounded-lg px-5 py-2.5 text-label-md font-semibold transition-colors ${
                    tab === item.id
                      ? 'bg-surface-container text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <MoveRiskScoreBadge
            result={riskResult}
            href={
              tab !== 'inputs'
                ? isDebug && debugRouteKey
                  ? debugLivingPath(debugRouteKey, 'inputs')
                  : `/report/${caseId}/inputs`
                : undefined
            }
            live={tab === 'inputs'}
          />
        </div>
      </div>

      <div>
        {tab === 'report' && (
          <ReportTab
            sections={sections}
            isGenerating={isGenerating}
            summary={report?.summary}
            versions={versions}
            latestJob={latestJob}
            name={caseDoc.name}
            routeTitle={route?.title}
            expectedSectionCount={(route?.reportSections?.length ?? 12) + 2}
            sidebarPlaceholders={(route?.reportSections ?? []).map((sectionKey) => ({
              sectionKey,
              title: sectionTitle(sectionKey),
            }))}
          />
        )}

        {tab === 'inputs' && (
          <InputsTab
            caseId={caseId}
            isDebug={isDebug}
            checkFieldKeys={checkFieldKeys}
            livingFieldKeys={livingFieldKeys}
            answers={savedAnswers}
            profileVersion={profile?.version ?? 1}
            pendingAffected={pendingAffected}
            pendingSummary={profile?.pendingChangeSummary}
            hasReport={!!report}
            onRegenerate={() => setTab('report')}
            onValuesChange={setLiveAnswers}
            riskScoring={route?.riskScoring}
          />
        )}

        {tab === 'packages' && (
          <PackagesTab caseId={caseId} isDebug={isDebug} packages={packages} />
        )}
      </div>
    </div>
  );
}

function LivingIntakePanel({
  caseId,
  routeTitle,
  routeFieldKeys,
  existingAnswers,
}: {
  caseId: Id<'cases'>;
  routeTitle: string;
  routeFieldKeys: string[];
  existingAnswers: Record<string, string>;
}) {
  const submitLiving = useMutation(api.intake.submitLivingIntake);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intakeFields = useMemo(() => livingIntakeFields(routeFieldKeys), [routeFieldKeys]);
  const groupedFields = useMemo(() => groupLivingFields(intakeFields), [intakeFields]);

  async function onSubmit(values: Record<string, string>) {
    setSubmitting(true);
    setError(null);
    const livingAnswers: Record<string, string> = {};
    for (const field of intakeFields) {
      const val = values[field.key]?.trim();
      if (val) livingAnswers[field.key] = val;
    }
    try {
      await submitLiving({ caseId, livingAnswers });
      window.location.href = `/report/${caseId}?tab=report`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  return (
    <div className="container-page section mx-auto max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">Almost there</p>
      <h1 className="mt-2 text-3xl font-bold text-on-surface">Complete your move profile</h1>
      <p className="mt-3 text-on-surface-variant">
        Route-specific details for your <strong>{routeTitle}</strong> Lifeport Plan. Your Lifeport
        Check answers are already included — work through one section at a time; skip anything you
        are not sure about yet.
      </p>

      <LivingGroupWizard
        groups={groupedFields}
        initialValues={existingAnswers}
        onSubmit={onSubmit}
        submitLabel="Generate Lifeport Plan"
        submittingLabel="Generating your Lifeport Plan…"
        submitting={submitting}
        error={error}
      />
    </div>
  );
}

function ReportTab({
  sections,
  isGenerating,
  summary,
  versions,
  latestJob,
  name,
  routeTitle,
  expectedSectionCount,
  sidebarPlaceholders,
}: {
  sections: Array<{
    _id: string;
    sectionKey: string;
    title: string;
    contentMarkdown: string;
    riskLevel?: string;
  }>;
  isGenerating: boolean;
  summary?: string;
  versions: Array<{ changeSummary: string; createdAt: number }>;
  latestJob?: { status: string; error?: string } | null;
  name: string;
  routeTitle?: string;
  expectedSectionCount: number;
  sidebarPlaceholders: ReadonlyArray<{ sectionKey: string; title: string }>;
}) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!isGenerating) return;
    const id = setInterval(() => setTick((t) => t + 1), 2200);
    return () => clearInterval(id);
  }, [isGenerating]);

  const progress = Math.round((sections.length / expectedSectionCount) * 100);

  if (isGenerating && sections.length === 0) {
    return (
      <Shell
        message={livingProgressMessage(tick % 5, { name, routeTitle })}
        subtitle="Sections appear as they're ready — no refresh needed."
      />
    );
  }

  return (
    <div>
      {isGenerating && (
        <div className="container-page mx-auto max-w-[1200px] pb-4 pt-6">
          <div className="report-soft-shadow mb-6 rounded-xl border border-primary/20 bg-primary-fixed/30 p-5">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
              <div className="flex-1">
                <p className="font-medium text-on-surface">
                  {livingProgressMessage(sections.length + (tick % 2), { name, routeTitle })}
                </p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {sections.length} of {expectedSectionCount} sections ready
                </p>
              </div>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-outline-variant/30">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${Math.max(progress, 6)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <ReportReader
        sections={sections.map((s) => ({
          id: s._id,
          sectionKey: s.sectionKey,
          title: s.title,
          contentMarkdown: s.contentMarkdown,
          riskLevel: s.riskLevel,
        }))}
        layout="editorial"
        sidebarPlaceholders={sidebarPlaceholders}
        progressIndex={isGenerating ? sections.length : undefined}
        progressTotal={isGenerating ? expectedSectionCount : undefined}
      />

      {isGenerating &&
        Array.from({ length: Math.max(0, expectedSectionCount - sections.length) })
          .slice(0, 3)
          .map((_, i) => (
            <div key={`skeleton-${i}`} className="mx-auto max-w-[1200px] px-6">
              <ReportSectionSkeleton title="Generating…" />
            </div>
          ))}

      {versions.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-6 pb-12">
          <div className="report-soft-shadow rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6">
          <h2 className="text-headline-sm font-semibold text-on-surface">Recent updates</h2>
          <ul className="mt-3 space-y-2 text-body-md text-on-surface-variant">
            {versions.map((v, i) => (
              <li key={i}>
                {v.changeSummary}{' '}
                <span className="text-outline">
                  ({new Date(v.createdAt).toLocaleDateString()})
                </span>
              </li>
            ))}
          </ul>
          </div>
        </section>
      )}

      {latestJob?.status === 'failed' && (
        <p className="mx-auto max-w-[1200px] px-6 pb-12 text-body-md text-error">
          {latestJob.error ?? 'Generation failed'}
        </p>
      )}
    </div>
  );
}

function InputsTab({
  caseId,
  isDebug = false,
  checkFieldKeys,
  livingFieldKeys,
  answers,
  profileVersion,
  pendingAffected,
  pendingSummary,
  hasReport,
  onRegenerate,
  onValuesChange,
  riskScoring,
}: {
  caseId: Id<'cases'>;
  isDebug?: boolean;
  checkFieldKeys: string[];
  livingFieldKeys: string[];
  answers: Record<string, string>;
  profileVersion: number;
  pendingAffected: string[];
  pendingSummary?: string;
  hasReport: boolean;
  onRegenerate: () => void;
  onValuesChange?: (values: Record<string, string>) => void;
  riskScoring?: import('@/lib/riskScore').RouteRiskScoringConfig;
}) {
  const updateProfile = useMutation(api.intake.updateMoveProfile);
  const requestRegen = useMutation(api.intake.requestRegeneration);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [draftChanges, setDraftChanges] = useState<Record<string, string>>({});
  const groupedFields = useMemo(
    () => inputsFieldsGrouped(checkFieldKeys, livingFieldKeys),
    [checkFieldKeys, livingFieldKeys],
  );
  const fields = useMemo(
    () => groupedFields.flatMap((g) => g.fields),
    [groupedFields],
  );
  const preview = useQuery(
    api.reports.getAffectedSectionsPreview,
    !isDebug && Object.keys(draftChanges).length > 0 ? { caseId, changes: draftChanges } : 'skip',
  );

  function trackChange(key: string, value: string) {
    const baseline = answers[key] ?? '';
    setDraftChanges((prev) => {
      const next = { ...prev };
      if (value === baseline) delete next[key];
      else next[key] = value;
      return next;
    });
  }

  async function onSubmit(values: Record<string, string>) {
    setSaving(true);
    setMessage(null);
    if (isDebug) {
      setMessage('Debug preview — changes are not saved.');
      setSaving(false);
      return;
    }
    const updates: Record<string, string> = {};
    for (const field of fields) {
      const val = values[field.key]?.trim() ?? '';
      if (val !== (answers[field.key] ?? '')) {
        updates[field.key] = val;
      }
    }
    if (Object.keys(updates).length === 0) {
      setMessage('No changes to save.');
      setSaving(false);
      return;
    }
    try {
      const result = await updateProfile({ caseId, updates });
      setDraftChanges({});
      if (result.affectedSections.length === 0) {
        setMessage('Saved. No report sections need updating.');
      } else {
        setMessage(
          `${result.affectedSections.length} section${result.affectedSections.length === 1 ? '' : 's'} may change: ${result.affectedSections.map((k) => sectionTitle(k)).join(', ')}.`,
        );
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12">
      <div className="report-soft-shadow max-w-3xl rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6">
        <p className="text-label-sm font-semibold uppercase tracking-wide text-primary">
          How updates work
        </p>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Update your move facts here. As you edit, Lifeport previews which report sections would
          change — save, then regenerate affected sections.
        </p>
      </div>

      {preview && preview.sections.length > 0 && (
        <div className="report-soft-shadow mt-8 max-w-3xl rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6">
          <p className="text-label-md font-semibold text-on-surface">Preview</p>
          <p className="mt-2 text-body-md text-on-surface-variant">
            {preview.changeSummary} — {preview.sections.map((k) => sectionTitle(k)).join(', ')}
          </p>
        </div>
      )}

      {pendingAffected.length > 0 && hasReport && !isDebug && (
        <div className="report-soft-shadow mt-8 max-w-3xl rounded-2xl border border-primary/20 bg-primary-fixed/30 p-6">
          <p className="text-headline-sm font-semibold text-on-surface">
            {pendingAffected.length} report section{pendingAffected.length === 1 ? '' : 's'} may
            change
          </p>
          <p className="mt-2 text-body-md text-on-surface-variant">
            {pendingSummary ?? pendingAffected.map((k) => sectionTitle(k)).join(', ')}
          </p>
          <Button
            className="mt-5"
            size="sm"
            disabled={regenerating}
            onClick={async () => {
              setRegenerating(true);
              try {
                await requestRegen({ caseId });
                setMessage('Regenerating affected sections…');
                onRegenerate();
              } catch (err) {
                setMessage(err instanceof Error ? err.message : 'Regeneration failed');
              } finally {
                setRegenerating(false);
              }
            }}
          >
            {regenerating ? 'Regenerating…' : 'Regenerate affected sections'}
          </Button>
        </div>
      )}

      <div className="mt-10">
        <LivingGroupWizard
          key={profileVersion}
          layout="sidebar"
          groups={groupedFields}
          initialValues={answers}
          onSubmit={onSubmit}
          submitLabel="Save changes"
          submitting={saving}
          onFieldChange={trackChange}
          onValuesChange={onValuesChange}
          riskScoring={riskScoring}
          footer={
            message ? (
              <p className="report-soft-shadow mt-5 rounded-2xl border border-outline-variant/10 bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface-variant">
                {message}
              </p>
            ) : null
          }
        />
      </div>
    </div>
  );
}

function PackagesTab({
  caseId,
  isDebug = false,
  packages,
}: {
  caseId: Id<'cases'>;
  isDebug?: boolean;
  packages: Array<{
    _id: string;
    packageKey: string;
    title: string;
    reason: string;
    outcome?: string;
    priceFrom?: number;
    status: string;
  }>;
}) {
  const requestPackage = useMutation(api.packages.requestPackage);
  const [requesting, setRequesting] = useState<string | null>(null);

  if (packages.length === 0) {
    return (
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="report-soft-shadow max-w-3xl rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-8 text-center">
          <p className="text-headline-sm font-medium text-on-surface">No packages yet</p>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Package recommendations appear once your Lifeport Plan is ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12">
      <ReportPackageGrid
        packages={packages}
        title="Recommended for your move"
        showRequest={!isDebug}
        requestingKey={requesting}
        onRequest={
          isDebug
            ? undefined
            : async (packageKey) => {
                setRequesting(packageKey);
                try {
                  await requestPackage({ caseId, packageKey });
                } finally {
                  setRequesting(null);
                }
              }
        }
      />
    </div>
  );
}

function Shell({
  message,
  subtitle,
  action,
}: {
  message: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="container-page section mx-auto max-w-lg text-center">
      {subtitle ? (
        <>
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="mt-6 text-lg font-semibold text-on-surface">{message}</p>
          <p className="mt-2 text-sm text-on-surface-variant">{subtitle}</p>
        </>
      ) : (
        <p className="text-lg font-semibold text-on-surface">{message}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
