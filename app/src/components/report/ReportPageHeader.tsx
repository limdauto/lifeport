import type { ReactNode } from 'react';
import { ReportIcon } from '@/components/report/ReportIcon';

export function ReportPageHeader({
  breadcrumb,
  title,
  description,
  sectionCount,
  meta,
  action,
}: {
  breadcrumb: string[];
  title: string;
  description?: string;
  sectionCount?: number;
  meta?: { icon?: string; label: string };
  action?: ReactNode;
}) {
  return (
    <section className="border-b border-outline-variant/30 bg-surface-container-lowest py-10">
      <div className="container-page mx-auto max-w-[1200px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <nav
              className="mb-4 flex flex-wrap items-center gap-2 font-medium text-label-sm text-on-surface-variant/60"
              aria-label="Breadcrumb"
            >
              {breadcrumb.map((part, i) => (
                <span key={part} className="flex items-center gap-2">
                  {i > 0 ? (
                    <ReportIcon name="chevron_right" size={12} className="text-on-surface-variant/50" />
                  ) : null}
                  <span className={i === breadcrumb.length - 1 ? 'text-on-surface-variant' : ''}>
                    {part}
                  </span>
                </span>
              ))}
            </nav>
            <h1 className="text-display text-on-surface">{title}</h1>
            {description ? (
              <p className="mt-2 max-w-2xl text-body-lg text-on-surface-variant">{description}</p>
            ) : null}
          </div>
          {(sectionCount != null || meta || action) && (
            <div className="flex flex-col items-start gap-4 md:items-end">
              {sectionCount != null ? (
                <div className="flex items-center gap-2 rounded-full border border-outline-variant/50 bg-surface-container px-4 py-2">
                  <ReportIcon name="analytics" className="text-primary" filled />
                  <span className="text-label-md font-semibold text-on-surface">
                    {sectionCount} section{sectionCount === 1 ? '' : 's'} analyzed
                  </span>
                </div>
              ) : null}
              {meta ? (
                <div className="flex items-center gap-2 rounded-full border border-outline-variant/50 bg-surface-container px-4 py-2">
                  <ReportIcon name={meta.icon ?? 'info'} className="text-primary" filled />
                  <span className="text-label-md font-semibold text-on-surface">{meta.label}</span>
                </div>
              ) : null}
              {action}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
