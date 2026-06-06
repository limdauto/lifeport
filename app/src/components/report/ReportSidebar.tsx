'use client';

import { useEffect, useState } from 'react';
import { ReportIcon } from '@/components/report/ReportIcon';
import { sectionIcon } from '@/lib/reportDesign';
import type { ReportSectionData } from '@/components/report/ReportSectionCard';

export function ReportSidebar({
  sections,
  pendingKeys,
  progressIndex,
  progressTotal,
}: {
  sections: ReportSectionData[];
  pendingKeys?: Set<string>;
  progressIndex?: number;
  progressTotal?: number;
}) {
  const [activeKey, setActiveKey] = useState(sections[0]?.sectionKey ?? '');

  useEffect(() => {
    const ids = sections
      .map((s) => s.sectionKey)
      .filter((key) => !pendingKeys?.has(key));
    function onScroll() {
      let current = ids[0] ?? '';
      for (const key of ids) {
        const el = document.getElementById(`section-${key}`);
        if (el && window.scrollY >= el.offsetTop - 160) {
          current = key;
        }
      }
      setActiveKey(current);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [sections, pendingKeys]);

  const readySections = sections.filter((s) => !pendingKeys?.has(s.sectionKey));
  const progress =
    progressTotal && progressTotal > 0
      ? Math.round(((progressIndex ?? 1) / progressTotal) * 100)
      : readySections.length > 0
        ? Math.round(
            ((readySections.findIndex((s) => s.sectionKey === activeKey) + 1) /
              readySections.length) *
              100,
          )
        : 0;

  const activeIdx = readySections.findIndex((s) => s.sectionKey === activeKey);

  return (
    <aside className="hidden w-64 shrink-0 md:block" aria-label="Report sections">
      <div className="sticky top-28 space-y-2">
        <p className="mb-6 pl-4 text-label-sm font-medium uppercase tracking-wider text-on-surface-variant">
          Jump to
        </p>
        <nav className="space-y-1">
          {sections.map((section) => {
            const pending = pendingKeys?.has(section.sectionKey);
            const active = !pending && section.sectionKey === activeKey;
            const className = `flex items-center gap-3 rounded-lg px-4 py-3 text-label-md transition-all ${
              pending
                ? 'cursor-default text-on-surface-variant/45'
                : active
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container'
            }`;

            if (pending) {
              return (
                <div key={section.sectionKey} className={className} aria-disabled>
                  <ReportIcon name={sectionIcon(section.sectionKey)} size={22} />
                  <span className="line-clamp-2 leading-snug">{section.title}</span>
                </div>
              );
            }

            return (
              <a key={section.sectionKey} href={`#section-${section.sectionKey}`} className={className}>
                <ReportIcon name={sectionIcon(section.sectionKey)} size={22} />
                <span className="line-clamp-2 leading-snug">{section.title}</span>
              </a>
            );
          })}
        </nav>

        <div className="mt-12 rounded-2xl border border-outline-variant/30 bg-secondary-container/30 p-6">
          <p className="mb-2 text-label-sm font-semibold text-on-secondary-container">Progress</p>
          <div className="h-1.5 overflow-hidden rounded-full bg-outline-variant/30">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${Math.max(progress, 8)}%` }}
            />
          </div>
          <p className="mt-2 text-label-sm text-on-surface-variant">
            Section {Math.max(activeIdx + 1, 1)} of {readySections.length || sections.length}
          </p>
        </div>
      </div>
    </aside>
  );
}
