import type { ReportSectionData } from '@/components/report/ReportSectionCard';

const SKIP_SIDEBAR = new Set(['change_log', 'premium_preview']);

export function buildSidebarNav(
  sections: ReportSectionData[],
  placeholders: ReadonlyArray<{ sectionKey: string; title: string }>,
): { nav: ReportSectionData[]; pendingKeys: Set<string> } {
  const completedKeys = new Set(sections.map((s) => s.sectionKey));
  const pendingKeys = new Set(
    placeholders
      .filter((p) => !completedKeys.has(p.sectionKey))
      .map((p) => p.sectionKey),
  );

  const nav: ReportSectionData[] = [
    ...sections.filter((s) => !SKIP_SIDEBAR.has(s.sectionKey) && !s.isPremiumLocked),
    ...placeholders
      .filter((p) => !completedKeys.has(p.sectionKey) && !SKIP_SIDEBAR.has(p.sectionKey))
      .map((p) => ({
        id: `pending-${p.sectionKey}`,
        sectionKey: p.sectionKey,
        title: p.title,
        contentMarkdown: '',
      })),
  ];

  return { nav, pendingKeys };
}
