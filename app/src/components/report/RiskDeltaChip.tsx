'use client';

import { ReportIcon } from '@/components/report/ReportIcon';

export function RiskDeltaChip({
  delta,
  direction,
  size = 'sm',
}: {
  delta: number;
  direction: 'up' | 'down';
  size?: 'sm' | 'md';
}) {
  const isWorse = direction === 'up';

  return (
    <span
      className={`risk-delta-enter inline-flex shrink-0 items-center gap-0.5 rounded-full font-bold tabular-nums ${
        size === 'md' ? 'px-3 py-1.5 text-label-sm' : 'px-2 py-1 text-[11px]'
      } ${
        isWorse
          ? 'bg-risk-high-container text-risk-high'
          : 'bg-risk-low-container text-risk-low'
      }`}
    >
      <ReportIcon
        name={isWorse ? 'trending_up' : 'trending_down'}
        size={size === 'md' ? 16 : 14}
        filled
      />
      {delta > 0 ? `+${delta}` : delta}
    </span>
  );
}
