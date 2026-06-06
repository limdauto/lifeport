'use client';

import Link from 'next/link';
import { ReportIcon } from '@/components/report/ReportIcon';
import { RiskDeltaChip } from '@/components/report/RiskDeltaChip';
import { RiskScoreGauge } from '@/components/report/RiskScoreGauge';
import { useRiskScoreDelta } from '@/hooks/useRiskScoreDelta';
import { riskBandMeta, type RiskScoreResult } from '@/lib/riskScore';

export function MoveRiskScoreBadge({
  result,
  href,
  live,
  className = '',
}: {
  result: RiskScoreResult;
  href?: string;
  live?: boolean;
  className?: string;
}) {
  const { delta, direction } = useRiskScoreDelta(result.score);
  const meta = riskBandMeta(result.band);

  const body = (
    <div
      className={`group flex items-center gap-3 rounded-2xl border border-outline-variant/35 bg-surface-container-lowest px-3 py-2 shadow-sm transition-all sm:gap-3.5 sm:px-3.5 ${href ? 'hover:border-primary/25 hover:shadow-md' : ''} ${className}`}
      style={{
        boxShadow: `inset 3px 0 0 0 ${meta.color}`,
      }}
    >
      <RiskScoreGauge score={result.score} band={result.band} size="compact" pulse={direction} />

      <div className="min-w-0 text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant">
          Move risk
        </p>
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
          <span className={`text-headline-sm font-bold tabular-nums leading-none ${meta.textClass}`}>
            {result.score}
          </span>
          <span className={`text-label-sm font-semibold ${meta.textClass}`}>{meta.shortLabel}</span>
        </div>
        <p className="mt-0.5 text-[10px] text-on-surface-variant/80">
          {live ? (
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-risk-low" aria-hidden />
              Updating live
            </span>
          ) : href ? (
            'Tap to improve score'
          ) : (
            'Lower is better'
          )}
        </p>
      </div>

      {delta != null && direction ? (
        <RiskDeltaChip delta={delta} direction={direction} />
      ) : null}

      {href ? (
        <ReportIcon
          name="chevron_right"
          className="hidden shrink-0 text-on-surface-variant/70 transition-transform group-hover:translate-x-0.5 sm:block"
          size={20}
        />
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="shrink-0"
        aria-label={`Move risk score ${result.score}, ${meta.label}. Open inputs to improve.`}
      >
        {body}
      </Link>
    );
  }

  return <div className="shrink-0">{body}</div>;
}
