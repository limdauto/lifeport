'use client';

import { RISK_BANDS, riskBandMeta, type RiskBand } from '@/lib/riskScore';

export function RiskScoreScale({ score, band }: { score: number; band: RiskBand }) {
  const active = riskBandMeta(band);

  return (
    <div className="w-full">
      <div className="relative h-2.5 overflow-hidden rounded-full bg-outline-variant/20">
        <div className="absolute inset-0 flex overflow-hidden rounded-full">
          {RISK_BANDS.map((zone) => (
            <div
              key={zone.shortLabel}
              className="h-full"
              style={{
                flex: zone.rangeEnd - zone.rangeStart + 1,
                backgroundColor: zone.color,
                opacity: zone.shortLabel.toLowerCase() === band.toLowerCase() ? 0.9 : 0.35,
              }}
            />
          ))}
        </div>
        <div
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface-container-lowest shadow-md transition-all duration-700 ease-out"
          style={{
            left: `${score}%`,
            backgroundColor: active.color,
          }}
          aria-hidden
        />
      </div>

      <div className="mt-2.5 grid grid-cols-4 gap-1 text-center">
        {RISK_BANDS.map((zone) => {
          const isActive = zone.shortLabel.toLowerCase() === band.toLowerCase();
          return (
            <div key={zone.shortLabel} className="min-w-0">
              <p
                className={`text-[10px] font-bold uppercase tracking-wide ${
                  isActive ? zone.textClass : 'text-on-surface-variant/55'
                }`}
              >
                {zone.shortLabel}
              </p>
              <p
                className={`text-[10px] tabular-nums ${
                  isActive ? 'font-semibold text-on-surface' : 'text-on-surface-variant/50'
                }`}
              >
                {zone.range}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
