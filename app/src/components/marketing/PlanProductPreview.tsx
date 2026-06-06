'use client';

import { useMemo } from 'react';
import { ReportIcon } from '@/components/report/ReportIcon';
import { MoveRiskScoreBadge } from '@/components/report/MoveRiskScoreBadge';
import { buildDebugLivingPayload } from '@/lib/debug/buildPayloads';
import { computeRiskScore } from '@/lib/riskScore';
import { inputsFieldsForRoute } from '@/lib/fieldDefs';
import { riskPillClass, riskPillLabel } from '@/lib/reportDesign';
import { PAID_PRODUCT_NAME } from '@/lib/copy';

const PREVIEW_SECTIONS = [
  'executive_brief',
  'hidden_dependencies',
  'timeline',
  'banking_money',
] as const;

export function PlanProductPreview() {
  const payload = useMemo(() => buildDebugLivingPayload('uk_to_dubai'), []);
  const route = payload?.route;
  const sections = payload?.sections.filter((s) =>
    PREVIEW_SECTIONS.includes(s.sectionKey as (typeof PREVIEW_SECTIONS)[number]),
  ) ?? [];
  const answers = payload?.profile?.rawAnswers ?? {};
  const riskFields = useMemo(
    () => (route ? inputsFieldsForRoute(route.checkFields, route.livingReportFields) : []),
    [route],
  );
  const risk = useMemo(
    () => computeRiskScore(answers, riskFields, route?.riskScoring),
    [answers, riskFields, route?.riskScoring],
  );

  if (!payload || !route) return null;

  const navSections = sections.slice(0, 4);

  return (
    <div className="dashboard-window overflow-hidden">
      <div className="border-b border-outline-variant/30 bg-surface-container-lowest px-4 py-3 md:px-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <nav className="mb-2 flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-on-surface-variant/70">
              <span>Reports</span>
              <ReportIcon name="chevron_right" size={10} />
              <span className="text-on-surface-variant">{PAID_PRODUCT_NAME}</span>
            </nav>
            <h3 className="text-headline-sm font-medium text-on-surface">
              Lifeport Plan — {route.title}
            </h3>
            <p className="mt-0.5 text-label-sm text-on-surface-variant">
              UK → Dubai · Profile v1
            </p>
          </div>
          <div className="hidden scale-90 sm:block">
            <MoveRiskScoreBadge result={risk} />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant/20 pt-3">
          <div className="flex gap-1">
            {(['Report', 'Inputs', 'Packages'] as const).map((tab, i) => (
              <span
                key={tab}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold ${
                  i === 0
                    ? 'bg-surface-container text-on-surface shadow-sm'
                    : 'text-on-surface-variant'
                }`}
              >
                {tab}
              </span>
            ))}
          </div>
          <span className="text-[10px] font-semibold text-on-surface-variant sm:hidden">
            Risk {risk.score}/100
          </span>
        </div>
      </div>

      <div className="dashboard-window-body bg-surface-container-low/40 p-4 md:p-5">
        <div className="flex gap-4 md:gap-6">
          <aside className="hidden w-36 shrink-0 md:block">
            <p className="mb-3 pl-1 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
              Jump to
            </p>
            <nav className="space-y-1">
              {navSections.map((section, i) => (
                <div
                  key={section.sectionKey}
                  className={`rounded-lg px-2.5 py-2 text-[11px] leading-snug ${
                    i === 0
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-on-surface-variant'
                  }`}
                >
                  {section.title}
                </div>
              ))}
            </nav>
          </aside>

          <div className="min-w-0 flex-1 space-y-3">
            {sections.slice(0, 2).map((section, index) => (
              <article
                key={section.sectionKey}
                className="report-soft-shadow rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-4"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container text-[10px] font-bold text-primary">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h4 className="text-label-md font-semibold text-on-surface">{section.title}</h4>
                  </div>
                  {section.riskLevel ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${riskPillClass(section.riskLevel)}`}
                    >
                      {riskPillLabel(section.riskLevel)}
                    </span>
                  ) : null}
                </div>
                <p className="line-clamp-3 text-[11px] leading-relaxed text-on-surface-variant">
                  {section.contentMarkdown.replace(/\*\*/g, '').replace(/\n/g, ' ').slice(0, 220)}…
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
