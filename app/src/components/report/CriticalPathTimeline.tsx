'use client';

import { ReportIcon } from '@/components/report/ReportIcon';
import { DOMAIN_META, inferDomain } from '@/lib/reportDesign';
import type { CriticalPathData } from '@/lib/criticalPath';

function stepDomain(label: string, subSteps?: string[]) {
  const text = [label, ...(subSteps ?? [])].join(' ');
  return inferDomain(text);
}

export function CriticalPathTimeline({ data }: { data: CriticalPathData }) {
  return (
    <div className="report-soft-shadow mt-8 rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-label-sm font-semibold uppercase tracking-widest text-error">
            Critical path
          </p>
          <h3 className="mt-1 text-headline-sm font-medium text-on-surface">{data.routeTitle}</h3>
        </div>
        <span className="rounded-full border border-outline-variant/40 bg-surface-container px-3 py-1 text-label-sm text-on-surface-variant">
          {data.steps.length} phases
        </span>
      </div>

      <div className="mt-8 overflow-x-auto pb-2">
        <div className="flex min-w-max items-start gap-2 md:gap-0">
          {data.steps.map((step, index) => {
            const domain = stepDomain(step.label, step.subSteps);
            const meta = DOMAIN_META[domain];
            const isLast = index === data.steps.length - 1;

            return (
              <div key={`${step.label}-${index}`} className="flex items-start">
                <div className="flex w-[11.5rem] flex-col sm:w-[13rem]">
                  <div
                    className={`rounded-2xl border border-outline-variant/10 border-t-4 bg-surface p-4 transition-colors hover:bg-surface-container ${meta.borderClass.replace('border-l-', 'border-t-')}`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container">
                        <ReportIcon name={meta.icon} className={meta.colorClass} size={18} filled={meta.fill} />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${meta.colorClass}`}>
                        {meta.label}
                      </span>
                    </div>
                    <p className="text-label-md font-semibold leading-snug text-on-surface">{step.label}</p>
                    {step.subSteps && step.subSteps.length > 0 ? (
                      <ul className="mt-3 space-y-1.5 border-t border-outline-variant/15 pt-3">
                        {step.subSteps.map((sub) => (
                          <li
                            key={sub}
                            className="flex items-start gap-1.5 text-label-sm text-on-surface-variant"
                          >
                            <ReportIcon name="subdirectory_arrow_right" size={14} className="mt-0.5 shrink-0 text-outline" />
                            <span>{sub}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                  <div className="mt-3 flex justify-center">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-on-primary">
                      {index + 1}
                    </span>
                  </div>
                </div>

                {!isLast ? (
                  <div className="hidden shrink-0 px-2 pt-10 md:flex md:items-center">
                    <ReportIcon name="arrow_forward" className="text-primary/70" size={22} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
