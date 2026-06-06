'use client';

import { useMemo } from 'react';
import { ReportContent } from '@/components/report/ReportContent';
import { ReportIcon } from '@/components/report/ReportIcon';
import { MoveStatusGrid } from '@/components/report/MoveStatusGrid';
import { DOMAIN_META, inferDomain } from '@/lib/reportDesign';
import { CriticalPathTimeline } from '@/components/report/CriticalPathTimeline';
import { markdownWithoutCriticalPath, parseCriticalPath } from '@/lib/criticalPath';
import { parseMoveSummaryContent } from '@/lib/moveStatus';
import { parseReportContent } from '@/lib/parseReportContent';
import type { ReportSectionData } from '@/components/report/ReportSectionCard';

function Html({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

function FindingCard({ text, index }: { text: string; index?: number }) {
  const domain = inferDomain(text);
  const meta = DOMAIN_META[domain];
  const clean = text.replace(/^\d+\.\s*/, '');

  return (
    <div className="group flex cursor-default gap-4 rounded-2xl border border-outline-variant/5 bg-surface p-5 transition-colors hover:bg-surface-container">
      <div className="flex w-12 shrink-0 flex-col items-center gap-1">
        <ReportIcon name={meta.icon} className={meta.colorClass} filled={meta.fill} />
        <span className={`text-[10px] font-bold uppercase tracking-wider ${meta.colorClass}`}>
          {meta.label}
        </span>
      </div>
      <p className="text-body-md text-on-surface">
        {index != null ? <span className="mr-1 font-semibold text-outline">{index}.</span> : null}
        <Html html={clean.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')} />
      </p>
    </div>
  );
}

function FrictionTile({ text }: { text: string }) {
  const domain = inferDomain(text);
  const meta = DOMAIN_META[domain];
  const label = stripHtml(text.replace(/^-\s*/, '').replace(/\*\*(.+?)\*\*/g, '$1'));

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-outline-variant/10 bg-surface p-4 border-l-4 ${meta.borderClass}`}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <ReportIcon name={meta.icon} className={`${meta.colorClass} text-sm`} size={18} filled={meta.fill} />
          <span className={`text-[10px] font-bold uppercase tracking-wider ${meta.colorClass}`}>
            {meta.label}
          </span>
        </div>
        <span className="text-label-md font-medium text-on-surface">{label}</span>
      </div>
    </div>
  );
}

export function ReportSectionBody({ section }: { section: ReportSectionData }) {
  const blocks = useMemo(() => parseReportContent(section.contentMarkdown), [section.contentMarkdown]);

  if (
    section.sectionKey === 'move_summary' ||
    section.sectionKey === 'move_profile' ||
    section.sectionKey === 'executive_brief'
  ) {
    const criticalPath = parseCriticalPath(section.contentMarkdown);
    const bodyMarkdown = criticalPath
      ? markdownWithoutCriticalPath(section.contentMarkdown)
      : section.contentMarkdown;
    const { narrative, concern, statuses } = parseMoveSummaryContent(bodyMarkdown);
    const extraBlocks = parseReportContent(bodyMarkdown);

    return (
      <>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-outline-variant/10 bg-surface p-6 md:p-8">
            <p className="text-body-lg leading-relaxed text-on-surface-variant">
              <Html html={narrative.replace(/\*\*(.+?)\*\*/g, '<strong class="text-on-surface">$1</strong>')} />
            </p>
            {concern ? (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-primary/10 bg-primary-fixed/25 px-4 py-3">
                <ReportIcon name="priority_high" className="shrink-0 text-primary" size={20} />
                <p className="text-label-md text-on-surface-variant">
                  Top concern: <span className="font-medium text-on-surface">{concern}</span>
                </p>
              </div>
            ) : null}
          </div>
          <MoveStatusGrid statuses={statuses} />
        </div>
        {criticalPath ? <CriticalPathTimeline data={criticalPath} /> : null}
        {statuses.length === 0 ? (
          <div className="mt-6">
            <ReportContent blocks={extraBlocks} variant="editorial" />
          </div>
        ) : null}
      </>
    );
  }

  if (section.sectionKey === 'top_findings') {
    const items = section.contentMarkdown
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => /^\d+\.\s/.test(l))
      .map((l) => l.replace(/^\d+\.\s/, ''));
    return (
      <div className="space-y-4">
        {items.map((item, i) => (
          <FindingCard key={i} text={item} index={i + 1} />
        ))}
      </div>
    );
  }

  if (section.sectionKey === 'likely_friction_areas' || section.sectionKey === 'friction_points') {
    const items = section.contentMarkdown
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('- '))
      .map((l) => l.slice(2));
    const intro = section.contentMarkdown
      .split('\n')
      .find((l) => l.trim() && !l.trim().startsWith('-'));
    return (
      <div>
        {intro ? (
          <p className="mb-6 text-body-md text-on-surface-variant">
            <Html html={intro.replace(/\*\*(.+?)\*\*/g, '<strong class="text-on-surface">$1</strong>')} />
          </p>
        ) : null}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((item, i) => (
            <FrictionTile key={i} text={item} />
          ))}
        </div>
      </div>
    );
  }

  if (section.sectionKey === 'recommended_next_step') {
    return (
      <div className="rounded-3xl border border-primary/10 bg-primary/5 p-8">
        <ReportContent blocks={blocks} variant="editorial" />
      </div>
    );
  }

  if (section.sectionKey === 'hidden_dependencies') {
    return <ReportContent blocks={blocks} variant="editorial" />;
  }

  if (section.sectionKey === 'risk_map') {
    const warnings = blocks.filter((b) => b.type === 'warning');
    const lists = blocks.filter((b) => b.type === 'list' || b.type === 'chain');
    if (warnings.length || lists.length) {
      return (
        <div className="space-y-4">
          {warnings.map((b, i) =>
            b.type === 'warning' ? <FindingCard key={`w-${i}`} text={stripHtml(b.html)} /> : null,
          )}
          <ReportContent blocks={lists} variant="editorial" />
        </div>
      );
    }
  }

  return <ReportContent blocks={blocks} variant="editorial" />;
}

export function PremiumUnlockSection({
  section,
  priceLabel,
  ctaHref,
  ctaLabel,
}: {
  section: ReportSectionData;
  priceLabel?: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  const body = section.contentMarkdown.replace(/\*\*/g, '');
  return (
    <section
      id={`section-${section.sectionKey}`}
      className="report-soft-shadow relative scroll-mt-32 overflow-hidden rounded-[2rem] bg-primary p-10 text-on-primary md:p-12"
    >
      <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-container opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-tertiary opacity-10 blur-2xl" />
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-on-primary/10 bg-on-primary/10 px-4 py-1.5 backdrop-blur-sm">
          <ReportIcon name="star" className="text-sm" filled />
          <span className="text-label-sm font-bold uppercase tracking-widest">Premium</span>
        </div>
        <h2 className="text-display text-on-primary">{section.title}</h2>
        <p className="mt-6 text-body-lg leading-relaxed text-on-primary/80">{body}</p>
        {ctaHref && ctaLabel ? (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <a
              href={ctaHref}
              className="w-full rounded-2xl bg-surface px-10 py-4 text-center text-label-md font-bold text-primary shadow-xl transition-all hover:bg-white sm:w-auto"
            >
              {ctaLabel}
            </a>
            {priceLabel ? (
              <span className="text-label-md text-on-primary/60">{priceLabel}</span>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
