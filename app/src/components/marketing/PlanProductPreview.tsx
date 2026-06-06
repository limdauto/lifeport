'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ReportIcon } from '@/components/report/ReportIcon';
import { MoveRiskScoreBadge } from '@/components/report/MoveRiskScoreBadge';
import { buildDebugLivingPayload } from '@/lib/debug/buildPayloads';
import { computeRiskScore, riskBandMeta } from '@/lib/riskScore';
import { inputsFieldsForRoute, type FieldDef } from '@/lib/fieldDefs';
import {
  riskPillClass,
  riskPillLabel,
  sectionIcon,
  setupNeedIcon,
  setupStatusTone,
} from '@/lib/reportDesign';
import { CHECK_CTA, PAID_PRODUCT_NAME, PLAN_CTA_HREF } from '@/lib/copy';

const URGENCY_SECTION_KEYS = ['hidden_dependencies', 'timeline', 'banking_money', 'executive_brief'] as const;

const OFFER_CHIPS = [
  { icon: 'timeline', label: 'Move timeline' },
  { icon: 'account_tree', label: 'Hidden dependencies' },
  { icon: 'speed', label: 'Live risk score' },
  { icon: 'inventory_2', label: 'Setup packages' },
] as const;

function weeksUntilMove(moveDate?: string): number | null {
  if (!moveDate) return null;
  const target = new Date(moveDate);
  if (Number.isNaN(target.getTime())) return null;
  const diff = target.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (7 * 24 * 60 * 60 * 1000)));
}

function formatMoveMonth(moveDate?: string): string | null {
  if (!moveDate) return null;
  const target = new Date(moveDate);
  if (Number.isNaN(target.getTime())) return null;
  return target.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

function openGapFields(fields: FieldDef[], answers: Record<string, string>) {
  return fields.filter((field) => {
    const value = answers[field.key];
    return !value || value === 'not_started' || value === 'dont_know';
  });
}

function gapHeadline(field: FieldDef): string {
  return field.label;
}

function sortGapsByRisk(
  gaps: FieldDef[],
  impacts: Record<string, number>,
): FieldDef[] {
  return [...gaps].sort((a, b) => (impacts[b.key] ?? 0) - (impacts[a.key] ?? 0));
}

type PlanProductPreviewProps = {
  /** Hero: small teaser above the fold. Section: fuller but still compact. */
  variant?: 'hero' | 'section';
};

export function PlanProductPreview({ variant = 'section' }: PlanProductPreviewProps) {
  const payload = useMemo(() => buildDebugLivingPayload('uk_to_dubai'), []);
  const route = payload?.route;
  const answers = payload?.profile?.rawAnswers ?? {};
  const riskFields = useMemo(
    () => (route ? inputsFieldsForRoute(route.checkFields, route.livingReportFields) : []),
    [route],
  );
  const risk = useMemo(
    () => computeRiskScore(answers, riskFields, route?.riskScoring),
    [answers, riskFields, route?.riskScoring],
  );

  const gaps = useMemo(() => openGapFields(riskFields, answers), [riskFields, answers]);
  const topGaps = useMemo(
    () => sortGapsByRisk(gaps, risk.fieldImpacts).slice(0, variant === 'hero' ? 2 : 3),
    [gaps, risk.fieldImpacts, variant],
  );

  const alertSections = useMemo(() => {
    const pool = payload?.sections ?? [];
    const picked = URGENCY_SECTION_KEYS.map((key) => pool.find((s) => s.sectionKey === key)).filter(
      Boolean,
    );
    return picked.slice(0, variant === 'hero' ? 1 : 2);
  }, [payload?.sections, variant]);

  const weeks = weeksUntilMove(answers.moveDate);
  const moveLabel = formatMoveMonth(answers.moveDate);
  const riskMeta = riskBandMeta(risk.band);

  if (!payload || !route) return null;

  if (variant === 'hero') {
    return (
      <div className="relative mx-auto w-full max-w-md lg:max-w-none">
        <div className="report-soft-shadow overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest">
          <div className="flex items-center justify-between gap-2 border-b border-error/15 bg-error-container/35 px-3.5 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-error" />
              </span>
              <p className="truncate text-[11px] font-semibold text-on-error-container">
                {weeks != null && moveLabel
                  ? `${weeks} weeks to ${moveLabel} move`
                  : 'Move timeline at risk'}
                {gaps.length > 0 ? ` · ${gaps.length} gaps open` : ''}
              </p>
            </div>
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-error">
              Act now
            </span>
          </div>

          <div className="space-y-3 p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                  {PAID_PRODUCT_NAME} preview
                </p>
                <p className="mt-0.5 text-label-md font-semibold text-on-surface">{route.title}</p>
              </div>
              <MoveRiskScoreBadge result={risk} className="!scale-[0.92] origin-top-right" />
            </div>

            <ul className="space-y-1.5">
              {topGaps.map((field) => {
                const tone = setupStatusTone(answers[field.key] ?? 'not_started');
                const icon = setupNeedIcon(field.key, field.label);
                return (
                  <li
                    key={field.key}
                    className="flex items-center gap-2 rounded-lg border border-outline-variant/15 bg-surface-container-low/80 px-2.5 py-2"
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${tone.iconWrapClass}`}
                      aria-hidden
                    >
                      <ReportIcon name={icon} size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-on-surface">
                        {gapHeadline(field)}
                      </p>
                      <p className="text-[10px] text-on-surface-variant">{tone.label}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Link
              href={PLAN_CTA_HREF}
              className="flex items-center justify-center gap-1 rounded-xl bg-primary px-3 py-2.5 text-[11px] font-semibold text-on-primary transition-opacity hover:opacity-90"
            >
              {CHECK_CTA} — see your gaps free
              <ReportIcon name="arrow_forward" size={14} />
            </Link>
          </div>
        </div>

        <p className="mt-3 text-center text-[10px] text-on-surface-variant/80">
          Sample plan · real report updates as your answers change
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="report-soft-shadow overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest">
        {/* Urgency strip */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-error/12 bg-gradient-to-r from-error-container/50 via-secondary-container/30 to-surface-container-low px-5 py-3 md:px-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-on-error-container">
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-50" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-error" />
              </span>
              {weeks != null && moveLabel
                ? `${weeks} weeks until move (${moveLabel})`
                : 'Move date approaching'}
            </span>
            <span className="hidden h-3 w-px bg-outline-variant/40 sm:block" aria-hidden />
            <span className="text-sm font-semibold text-on-surface">
              <span className="text-error">{gaps.length} setup gaps</span> flagged before you land
            </span>
          </div>
          <span className={`text-sm font-bold ${riskMeta.textClass}`}>
            Risk {risk.score} · {riskMeta.shortLabel}
          </span>
        </div>

        {/* Compact product body */}
        <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="border-b border-outline-variant/15 p-5 md:border-b-0 md:border-r md:p-6">
            <MoveRiskScoreBadge result={risk} live className="w-full max-w-none" />
            <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
              Your score shifts as visa, banking, housing and tax answers change — so you see what to
              fix <span className="font-semibold text-on-surface">before</span> deadlines slip.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {OFFER_CHIPS.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1.5 text-xs font-medium text-on-surface-variant"
                >
                  <ReportIcon name={chip.icon} size={14} className="text-primary" />
                  {chip.label}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 md:p-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
              What needs attention first
            </p>
            <ul className="space-y-2.5">
              {topGaps.map((field) => {
                const tone = setupStatusTone(answers[field.key] ?? 'not_started');
                const icon = setupNeedIcon(field.key, field.label);
                return (
                  <li
                    key={field.key}
                    className="flex items-center gap-2.5 rounded-xl border border-outline-variant/15 bg-surface-container-low/60 px-2.5 py-2"
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tone.iconWrapClass}`}
                      aria-hidden
                    >
                      <ReportIcon name={icon} size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-on-surface">{gapHeadline(field)}</p>
                      <p className="text-xs text-on-surface-variant">{tone.label}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            {alertSections.map((section) => (
              <article
                key={section!.sectionKey}
                className="mt-3 rounded-xl border border-outline-variant/15 bg-surface-container-lowest px-4 py-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <ReportIcon
                      name={sectionIcon(section!.sectionKey)}
                      size={16}
                      className="shrink-0 text-primary"
                    />
                    <h4 className="truncate text-sm font-semibold text-on-surface">
                      {section!.title}
                    </h4>
                  </div>
                  {section!.riskLevel ? (
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${riskPillClass(section!.riskLevel)}`}
                    >
                      {riskPillLabel(section!.riskLevel)}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-on-surface-variant">
                  {section!.contentMarkdown.replace(/\*\*/g, '').replace(/\n/g, ' ').slice(0, 140)}…
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/15 bg-surface-container-low/50 px-5 py-3 md:px-6">
          <p className="text-xs text-on-surface-variant">
            One private plan — report, inputs, packages, expert review
          </p>
          <Link
            href={PLAN_CTA_HREF}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Start with free Lifeport Check
            <ReportIcon name="arrow_forward" size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
