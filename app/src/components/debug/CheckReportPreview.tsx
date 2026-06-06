'use client';

import { ReportPageHeader } from '@/components/report/ReportPageHeader';
import { ReportReader } from '@/components/report/ReportReader';
import { Button } from '@/components/marketing/Button';
import { DebugBanner } from '@/components/debug/DebugBanner';
import { CHECK_SECTION_PLACEHOLDERS } from '@/lib/check';
import { FREE_PRODUCT_NAME, LIVING_CTA, PAID_PRODUCT_NAME } from '@/lib/copy';
import type { RouteConfig } from '@/lib/routes';

const CHECK_SUBTITLE =
  'A comprehensive first look at the key regulatory, financial, and logistical areas your move will affect.';

export function CheckReportPreview({
  route,
  report,
  sections,
  packages,
  caseName,
}: {
  route: RouteConfig;
  report: { title: string };
  sections: Array<{
    _id: string;
    sectionKey: string;
    title: string;
    contentMarkdown: string;
    riskLevel?: string;
    isPremiumLocked?: boolean;
  }>;
  packages?: Array<{
    _id: string;
    title: string;
    reason: string;
    priceFrom?: number;
  }>;
  caseName: string;
}) {
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

  return (
    <div className="-mx-[var(--spacing-gutter,1.5rem)] sm:mx-0">
      <DebugBanner label={`${FREE_PRODUCT_NAME} · ${route.title}`} />

      <ReportPageHeader
        breadcrumb={['Debug', `Your ${FREE_PRODUCT_NAME}`]}
        title={report.title}
        description={CHECK_SUBTITLE}
        sectionCount={sections.length}
        action={<Button href={`/debug/living/${route.routeKey}`}>{LIVING_CTA}</Button>}
      />

      <ReportReader
        sections={sectionData}
        layout="editorial"
        sidebarPlaceholders={CHECK_SECTION_PLACEHOLDERS}
        packages={packages}
        premiumCta={{
          href: `/debug/living/${route.routeKey}`,
          label: LIVING_CTA,
          priceLabel: `From £${route.livingPriceGbp} for ${route.title}`,
        }}
      />

      <p className="mx-auto max-w-[1200px] px-6 pb-8 text-center text-label-sm text-on-surface-variant">
        Preview for <strong>{caseName}</strong> — generated from debug fixtures.
      </p>
    </div>
  );
}
