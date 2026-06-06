'use client';

import { useState } from 'react';
import { ReportSectionBody } from '@/components/report/ReportSectionBody';
import { ReportIcon } from '@/components/report/ReportIcon';
import {
  isCriticalPathSection,
  isPremiumHeroSection,
  riskPillClass,
  riskPillLabel,
} from '@/lib/reportDesign';
import { sectionMeta } from '@/lib/reportSectionMeta';

export type ReportSectionData = {
  id: string;
  sectionKey: string;
  title: string;
  contentMarkdown: string;
  riskLevel?: string;
  isPremiumLocked?: boolean;
  lockedMessage?: string;
};

export function ReportSectionCard({
  section,
  index,
  layout = 'editorial',
  forceOpen,
  onInteract,
}: {
  section: ReportSectionData;
  index: number;
  layout?: 'editorial' | 'compact';
  forceOpen?: boolean;
  onInteract?: () => void;
}) {
  const meta = sectionMeta(section.sectionKey, section.riskLevel);

  if (isPremiumHeroSection(section.sectionKey)) {
    return null;
  }

  if (section.isPremiumLocked) {
    return (
      <article
        id={`section-${section.sectionKey}`}
        className="report-soft-shadow scroll-mt-32 rounded-[1.5rem] border border-primary/20 bg-primary-fixed/15 p-8"
      >
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-headline-md font-medium text-on-surface">{section.title}</h2>
          <span className="rounded-full bg-primary px-3 py-1 text-label-sm font-semibold text-on-primary">
            Premium
          </span>
        </div>
        <p className="mt-4 text-body-md text-on-surface-variant">
          {section.lockedMessage ?? 'Unlock your Lifeport Plan to see full analysis for this section.'}
        </p>
      </article>
    );
  }

  const isEditorial = layout === 'editorial';
  const critical = isCriticalPathSection(section.sectionKey);

  if (!isEditorial) {
    return <CompactSectionCard section={section} index={index} forceOpen={forceOpen} onInteract={onInteract} meta={meta} />;
  }

  return (
    <article
      id={`section-${section.sectionKey}`}
      className={`report-soft-shadow scroll-mt-32 rounded-[1.5rem] border border-outline-variant/20 bg-surface-container-lowest p-6 md:p-8 ${
        critical ? 'border-l-4 border-l-error' : ''
      }`}
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-sm font-bold text-primary">
            {String(index + 1).padStart(2, '0')}
          </div>
          <div>
            <span className="text-label-sm font-medium uppercase tracking-widest text-on-surface-variant">
              {meta.categoryLabel}
            </span>
            <h2 className="text-headline-md font-medium text-on-surface">{section.title}</h2>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-label-sm ${riskPillClass(section.riskLevel)}`}
        >
          {riskPillLabel(section.riskLevel)}
        </span>
      </div>
      <ReportSectionBody section={section} />
    </article>
  );
}

function CompactSectionCard({
  section,
  index,
  forceOpen,
  onInteract,
  meta,
}: {
  section: ReportSectionData;
  index: number;
  forceOpen?: boolean;
  onInteract?: () => void;
  meta: ReturnType<typeof sectionMeta>;
}) {
  const [open, setOpen] = useState(meta.defaultOpen);
  const isOpen = forceOpen !== undefined ? forceOpen : open;

  return (
    <article
      id={`section-${section.sectionKey}`}
      className={`scroll-mt-32 overflow-hidden rounded-xl border border-outline-variant/40 border-l-4 ${meta.accentClass}`}
    >
      <button
        type="button"
        onClick={() => {
          onInteract?.();
          setOpen((v) => !v);
        }}
        className="flex w-full items-start gap-4 px-5 py-4 text-left hover:bg-surface-container-low/50"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-xs font-bold">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-outline">
            {meta.categoryLabel}
          </span>
          <h2 className="text-lg font-semibold text-on-surface">{section.title}</h2>
        </div>
        <ReportIcon name="expand_more" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen ? (
        <div className="border-t border-outline-variant/30 px-5 pb-5 pt-4">
          <ReportSectionBody section={section} />
        </div>
      ) : null}
    </article>
  );
}
