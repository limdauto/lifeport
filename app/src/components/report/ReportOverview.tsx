'use client';

import { RiskBadge } from '@/components/RiskBadge';
import { extractWarnings, riskRank, type RiskLevel } from '@/lib/parseReportContent';
import type { ReportSectionData } from '@/components/report/ReportSectionCard';

function countByRisk(sections: ReportSectionData[]) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const s of sections) {
    const k = (s.riskLevel ?? 'unknown') as RiskLevel;
    if (k in counts) counts[k as keyof typeof counts]++;
  }
  return counts;
}

export function ReportOverview({
  sections,
  summary,
  name,
  routeTitle,
}: {
  sections: ReportSectionData[];
  summary?: string;
  name?: string;
  routeTitle?: string;
}) {
  const contentSections = sections.filter(
    (s) => !s.isPremiumLocked && s.sectionKey !== 'change_log' && s.sectionKey !== 'recommended_packages',
  );
  const risks = countByRisk(contentSections);
  const attentionCount = risks.critical + risks.high + risks.medium;
  const warnings = contentSections
    .flatMap((s) => extractWarnings(s.contentMarkdown))
    .slice(0, 4);
  const topRisks = [...contentSections]
    .sort((a, b) => riskRank(b.riskLevel) - riskRank(a.riskLevel))
    .filter((s) => riskRank(s.riskLevel) >= 2)
    .slice(0, 5);

  if (contentSections.length === 0) return null;

  return (
    <section className="report-overview mb-8 overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-sm">
      <div className="border-b border-outline-variant/30 bg-gradient-to-br from-primary-fixed/40 to-surface-container-low px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">At a glance</p>
        {name ? (
          <h2 className="mt-1 text-xl font-bold text-on-surface">
            {name}
            {routeTitle ? (
              <span className="font-medium text-on-surface-variant"> · {routeTitle}</span>
            ) : null}
          </h2>
        ) : null}
        {summary ? <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">{summary}</p> : null}
      </div>

      <div className="grid gap-px bg-outline-variant/20 sm:grid-cols-4">
        <StatCell label="Sections" value={String(contentSections.length)} />
        <StatCell
          label="Needs attention"
          value={String(attentionCount)}
          highlight={attentionCount > 0}
        />
        <StatCell label="High risk" value={String(risks.high + risks.critical)} />
        <StatCell label="Warnings" value={String(warnings.length)} />
      </div>

      {(warnings.length > 0 || topRisks.length > 0) && (
        <div className="grid gap-6 p-6 md:grid-cols-2">
          {warnings.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold text-on-surface">Flags to act on</h3>
              <ul className="mt-3 space-y-2">
                {warnings.map((w, i) => (
                  <li
                    key={i}
                    className="flex gap-2 rounded-lg bg-error-container/35 px-3 py-2 text-sm text-on-error-container"
                  >
                    <span className="font-bold">!</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {topRisks.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold text-on-surface">Highest-risk areas</h3>
              <ul className="mt-3 space-y-2">
                {topRisks.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#section-${s.sectionKey}`}
                      className="flex items-center justify-between gap-2 rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-2 text-sm transition-colors hover:border-primary/30 hover:bg-primary-fixed/20"
                    >
                      <span className="font-medium text-on-surface">{s.title}</span>
                      <RiskBadge level={s.riskLevel} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

function StatCell({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-surface-container-lowest px-5 py-4 ${highlight ? 'bg-error-container/15' : ''}`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-outline">{label}</p>
      <p
        className={`mt-1 text-2xl font-bold tabular-nums ${highlight ? 'text-error' : 'text-on-surface'}`}
      >
        {value}
      </p>
    </div>
  );
}
