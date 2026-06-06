'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import type { Id } from 'convex/_generated/dataModel';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { livingProgressMessage } from '@/lib/living';
import { Markdown } from '@/components/Markdown';
import { RiskBadge } from '@/components/RiskBadge';
import { Button } from '@/components/marketing/Button';
import { IntakeField } from '@/components/IntakeField';
import {
  groupLivingFields,
  inputsFieldsForRoute,
  livingIntakeFields,
  type FieldDef,
} from '@/lib/fieldDefs';
import { sectionTitle } from '@/lib/sectionTitles';
import { FREE_PRODUCT_NAME, LIVING_CTA, PAID_PRODUCT_NAME } from '@/lib/copy';

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
  const data = useQuery(api.reports.getLivingReport, { caseId });

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
        message="Your Living Report is ready — expert review in progress"
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
    <div className="container-page section mx-auto max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            {PAID_PRODUCT_NAME}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-on-surface">
            {report?.title ?? `Living Report — ${route?.title}`}
          </h1>
          <p className="mt-2 text-on-surface-variant">
            {route?.title} · Profile v{profile?.version ?? 1}
          </p>
        </div>
        <Link
          href={`/check/result/${caseId}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          View {FREE_PRODUCT_NAME}
        </Link>
      </div>

      <nav className="mt-8 flex gap-1 rounded-xl border border-outline-variant/50 bg-surface-container-low p-1">
        {(
          [
            { id: 'report' as Tab, href: `/report/${caseId}`, label: 'Report' },
            { id: 'inputs' as Tab, href: `/report/${caseId}/inputs`, label: 'Inputs' },
            { id: 'packages' as Tab, href: `/report/${caseId}/packages`, label: 'Packages' },
          ] as const
        ).map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => setTab(item.id)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
              tab === item.id
                ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {tab === 'report' && (
        <ReportTab
          sections={sections}
          isGenerating={!!isGenerating}
          summary={report?.summary}
          versions={versions}
          latestJob={latestJob}
          name={caseDoc.name}
          routeTitle={route?.title}
          expectedSectionCount={(route?.reportSections.length ?? 12) + 2}
        />
      )}

      {tab === 'inputs' && (
        <InputsTab
          caseId={caseId}
          checkFieldKeys={route?.checkFields ?? []}
          livingFieldKeys={route?.livingReportFields ?? []}
          answers={(profile?.rawAnswers as Record<string, string>) ?? {}}
          profileVersion={profile?.version ?? 1}
          pendingAffected={pendingAffected}
          pendingSummary={profile?.pendingChangeSummary}
          hasReport={!!report}
          onRegenerate={() => setTab('report')}
        />
      )}

      {tab === 'packages' && (
        <PackagesTab caseId={caseId} packages={packages} />
      )}
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

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const livingAnswers: Record<string, string> = {};
    for (const field of intakeFields) {
      const val = String(form.get(field.key) ?? '').trim();
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
        Route-specific details for your <strong>{routeTitle}</strong> Living Report. Your Lifeport
        Check answers are already included — fill in what you know; you can update everything later
        in Inputs.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-8">
        {groupedFields.map(({ group, label, fields }) => (
          <fieldset key={group} className="space-y-4">
            <legend className="text-sm font-semibold uppercase tracking-wide text-primary">
              {label}
            </legend>
            {fields.map((field) => (
              <IntakeField
                key={field.key}
                field={field}
                defaultValue={existingAnswers[field.key]}
              />
            ))}
          </fieldset>
        ))}

        {error && (
          <p className="rounded-lg bg-error-container px-4 py-3 text-sm text-on-error-container">
            {error}
          </p>
        )}

        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? 'Generating your Living Report…' : 'Generate Living Report'}
        </Button>
      </form>
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
    <div className="mt-8">
      {isGenerating && (
        <div className="mb-6 rounded-xl border border-primary/20 bg-primary-fixed/30 p-5">
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
      )}

      {summary && !isGenerating && <p className="mb-8 text-on-surface-variant">{summary}</p>}

      {!isGenerating && sections.length > 4 && (
        <nav className="mb-8 rounded-xl border border-outline-variant/40 bg-surface-container-low p-5">
          <p className="text-sm font-semibold text-on-surface">Contents</p>
          <ul className="mt-3 columns-1 gap-x-6 text-sm sm:columns-2">
            {sections
              .filter((s) => s.sectionKey !== 'change_log')
              .map((section) => (
                <li key={section.sectionKey} className="mb-1.5 break-inside-avoid">
                  <a
                    href={`#section-${section.sectionKey}`}
                    className="text-primary hover:underline"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
          </ul>
        </nav>
      )}

      <div className="space-y-6">
        {sections.map((section) => (
          <article
            key={section._id}
            id={`section-${section.sectionKey}`}
            className="scroll-mt-24 rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-semibold text-on-surface">{section.title}</h2>
              <RiskBadge level={section.riskLevel} />
            </div>
            <div className="mt-4">
              <Markdown content={section.contentMarkdown} />
            </div>
          </article>
        ))}

        {isGenerating &&
          Array.from({ length: Math.max(0, expectedSectionCount - sections.length) })
            .slice(0, 3)
            .map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest/50 p-6"
              >
                <div className="h-5 w-40 animate-pulse rounded bg-outline-variant/25" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-outline-variant/20" />
                  <div className="h-3 w-4/5 animate-pulse rounded bg-outline-variant/15" />
                </div>
              </div>
            ))}
      </div>

      {versions.length > 0 && (
        <section className="mt-12 rounded-xl border border-outline-variant/40 p-6">
          <h2 className="text-lg font-semibold text-on-surface">Recent updates</h2>
          <ul className="mt-3 space-y-2 text-sm text-on-surface-variant">
            {versions.map((v, i) => (
              <li key={i}>
                {v.changeSummary}{' '}
                <span className="text-outline">
                  ({new Date(v.createdAt).toLocaleDateString()})
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {latestJob?.status === 'failed' && (
        <p className="mt-6 text-sm text-error">{latestJob.error ?? 'Generation failed'}</p>
      )}
    </div>
  );
}

function InputsTab({
  caseId,
  checkFieldKeys,
  livingFieldKeys,
  answers,
  profileVersion,
  pendingAffected,
  pendingSummary,
  hasReport,
  onRegenerate,
}: {
  caseId: Id<'cases'>;
  checkFieldKeys: string[];
  livingFieldKeys: string[];
  answers: Record<string, string>;
  profileVersion: number;
  pendingAffected: string[];
  pendingSummary?: string;
  hasReport: boolean;
  onRegenerate: () => void;
}) {
  const updateProfile = useMutation(api.intake.updateMoveProfile);
  const requestRegen = useMutation(api.intake.requestRegeneration);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [draftChanges, setDraftChanges] = useState<Record<string, string>>({});
  const fields = useMemo(
    () => inputsFieldsForRoute(checkFieldKeys, livingFieldKeys),
    [checkFieldKeys, livingFieldKeys],
  );
  const preview = useQuery(
    api.reports.getAffectedSectionsPreview,
    Object.keys(draftChanges).length > 0 ? { caseId, changes: draftChanges } : 'skip',
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

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const form = new FormData(e.currentTarget);
    const updates: Record<string, string> = {};
    for (const field of fields) {
      const val = String(form.get(field.key) ?? '');
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
    <div className="mt-8 max-w-2xl">
      <p className="text-on-surface-variant">
        Update your move facts here. As you edit, Lifeport previews which report sections would
        change — save, then regenerate affected sections.
      </p>

      {preview && preview.sections.length > 0 && (
        <div className="mt-6 rounded-xl border border-outline-variant/50 bg-surface-container-low p-4">
          <p className="text-sm font-medium text-on-surface">Preview</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            {preview.changeSummary} —{' '}
            {preview.sections.map((k) => sectionTitle(k)).join(', ')}
          </p>
        </div>
      )}

      {pendingAffected.length > 0 && hasReport && (
        <div className="mt-6 rounded-xl border border-primary/30 bg-primary-container/40 p-5">
          <p className="font-semibold text-on-primary-container">
            {pendingAffected.length} report section{pendingAffected.length === 1 ? '' : 's'} may
            change
          </p>
          <p className="mt-1 text-sm text-on-primary-container/90">
            {pendingSummary ?? pendingAffected.map((k) => sectionTitle(k)).join(', ')}
          </p>
          <Button
            className="mt-4"
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

      <form key={profileVersion} onSubmit={onSubmit} className="mt-8 space-y-5">
        {fields.map((field: FieldDef) => (
          <IntakeField
            key={field.key}
            field={field}
            defaultValue={answers[field.key]}
            onChange={(value) => trackChange(field.key, value)}
          />
        ))}

        {message && (
          <p className="rounded-lg bg-surface-container-high px-4 py-3 text-sm text-on-surface-variant">
            {message}
          </p>
        )}

        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </form>
    </div>
  );
}

function PackagesTab({
  caseId,
  packages,
}: {
  caseId: Id<'cases'>;
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
      <p className="mt-8 text-on-surface-variant">
        Package recommendations appear once your Living Report is ready.
      </p>
    );
  }

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {packages.map((pkg) => (
        <div
          key={pkg._id}
          className="rounded-xl border border-outline-variant/50 bg-surface-container-low p-5"
        >
          <h3 className="font-semibold text-on-surface">{pkg.title}</h3>
          {pkg.outcome ? (
            <p className="mt-2 text-sm text-on-surface-variant">{pkg.outcome}</p>
          ) : null}
          <p className="mt-2 text-sm text-on-surface-variant/80">{pkg.reason}</p>
          {pkg.priceFrom != null && (
            <p className="mt-3 text-sm font-semibold text-primary">From £{pkg.priceFrom}</p>
          )}
          <Button
            size="sm"
            variant={pkg.status === 'requested' ? 'outline' : 'primary'}
            className="mt-4"
            disabled={pkg.status === 'requested' || requesting === pkg.packageKey}
            onClick={async () => {
              setRequesting(pkg.packageKey);
              try {
                await requestPackage({ caseId, packageKey: pkg.packageKey });
              } finally {
                setRequesting(null);
              }
            }}
          >
            {pkg.status === 'requested'
              ? 'Requested'
              : requesting === pkg.packageKey
                ? 'Requesting…'
                : 'Request package'}
          </Button>
        </div>
      ))}
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
