'use client';

import { useMemo } from 'react';
import { PremiumUnlockSection } from '@/components/report/ReportSectionBody';
import { ReportPackageGrid } from '@/components/report/ReportPackageGrid';
import { ReportSidebar } from '@/components/report/ReportSidebar';
import {
  ReportSectionCard,
  type ReportSectionData,
} from '@/components/report/ReportSectionCard';
import { isPremiumHeroSection } from '@/lib/reportDesign';
import { buildSidebarNav } from '@/lib/reportNav';

export function ReportReader({
  sections,
  layout = 'editorial',
  packages,
  premiumCta,
  progressIndex,
  progressTotal,
  sidebarPlaceholders,
}: {
  sections: ReportSectionData[];
  layout?: 'editorial' | 'compact';
  packages?: Array<{ _id: string; title: string; reason: string; priceFrom?: number }>;
  premiumCta?: { href: string; label: string; priceLabel?: string };
  progressIndex?: number;
  progressTotal?: number;
  sidebarPlaceholders?: ReadonlyArray<{ sectionKey: string; title: string }>;
}) {
  const { nav: sidebarSections, pendingKeys } = useMemo(
    () =>
      sidebarPlaceholders?.length
        ? buildSidebarNav(sections, sidebarPlaceholders)
        : {
            nav: sections.filter((s) => !s.isPremiumLocked && s.sectionKey !== 'change_log'),
            pendingKeys: new Set<string>(),
          },
    [sections, sidebarPlaceholders],
  );

  let displayIndex = 0;

  return (
    <div className="mx-auto flex max-w-[1200px] gap-12 px-6 py-12 md:flex-row">
      {layout === 'editorial' ? (
        <ReportSidebar
          sections={sidebarSections}
          pendingKeys={pendingKeys}
          progressIndex={progressIndex}
          progressTotal={progressTotal}
        />
      ) : null}

      <div className="min-w-0 flex-1 space-y-12">
        {sections.map((section) => {
          if (isPremiumHeroSection(section.sectionKey)) {
            return (
              <PremiumUnlockSection
                key={section.id}
                section={section}
                ctaHref={premiumCta?.href}
                ctaLabel={premiumCta?.label}
                priceLabel={premiumCta?.priceLabel}
              />
            );
          }

          const card = (
            <ReportSectionCard
              key={section.id}
              section={section}
              index={displayIndex}
              layout={layout}
            />
          );
          displayIndex += 1;
          return card;
        })}

        {packages && packages.length > 0 ? <ReportPackageGrid packages={packages} /> : null}
      </div>
    </div>
  );
}

export function ReportSectionSkeleton({ title }: { title: string }) {
  return (
    <article className="report-soft-shadow animate-pulse rounded-[1.5rem] border border-outline-variant/20 bg-surface-container-lowest p-8">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-outline-variant/25" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-outline-variant/20" />
          <div className="h-6 w-56 rounded bg-outline-variant/25" />
        </div>
      </div>
      <p className="mt-6 text-sm text-on-surface-variant/50">{title}</p>
    </article>
  );
}
