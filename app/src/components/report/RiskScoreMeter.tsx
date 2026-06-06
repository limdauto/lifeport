'use client';

import { RiskDeltaChip } from '@/components/report/RiskDeltaChip';
import { RiskScoreGauge } from '@/components/report/RiskScoreGauge';
import { RiskScoreScale } from '@/components/report/RiskScoreScale';
import { useRiskScoreDelta } from '@/hooks/useRiskScoreDelta';
import { riskBandMeta, type RiskScoreResult } from '@/lib/riskScore';

export function RiskScoreMeter({ result }: { result: RiskScoreResult }) {
  const { delta, direction } = useRiskScoreDelta(result.score);
  const meta = riskBandMeta(result.band);

  return (
    <div
      className="overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-lowest report-soft-shadow"
      style={{
        backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${meta.color} 8%, transparent) 0%, transparent 42%)`,
      }}
    >
      <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:gap-8 md:p-6">
        <div className="flex shrink-0 justify-center md:w-[13.75rem]">
          <RiskScoreGauge score={result.score} band={result.band} size="hero" pulse={direction} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-label-sm font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                Move risk score
              </p>
              <p className={`mt-1 text-headline-md font-semibold ${meta.textClass}`}>{meta.label}</p>
              <p className="mt-2 max-w-prose text-body-md text-on-surface-variant">{meta.hint}</p>
            </div>

            <div className="flex flex-col items-end gap-2">
              {delta != null && direction ? (
                <RiskDeltaChip delta={delta} direction={direction} size="md" />
              ) : null}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-risk-low" aria-hidden />
                Live score
              </span>
            </div>
          </div>

          <div className="mt-6">
            <RiskScoreScale score={result.score} band={result.band} />
          </div>
        </div>
      </div>
    </div>
  );
}
