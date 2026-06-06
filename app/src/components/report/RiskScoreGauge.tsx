'use client';

import { riskBandMeta, type RiskBand } from '@/lib/riskScore';

const BAND_ARCS = [
  { band: 'low' as RiskBand, start: 0, end: 34 },
  { band: 'moderate' as RiskBand, start: 35, end: 54 },
  { band: 'elevated' as RiskBand, start: 55, end: 74 },
  { band: 'high' as RiskBand, start: 75, end: 100 },
];

/** Upper semicircle: score 0 = left, 100 = right, 50 = top. */
function scoreAngle(score: number): number {
  return Math.PI * (1 - score / 100);
}

function polar(cx: number, cy: number, r: number, score: number) {
  const t = scoreAngle(score);
  return {
    x: cx + r * Math.cos(t),
    y: cy - r * Math.sin(t),
  };
}

function arcPath(cx: number, cy: number, r: number, startScore: number, endScore: number) {
  const start = polar(cx, cy, r, startScore);
  const end = polar(cx, cy, r, endScore);
  const span = scoreAngle(startScore) - scoreAngle(endScore);
  const large = span > Math.PI ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

type GaugeSize = 'compact' | 'hero';

const GAUGE_CONFIG: Record<
  GaugeSize,
  { width: number; arcHeight: number; cx: number; cy: number; r: number; stroke: number; marker: number }
> = {
  compact: { width: 56, arcHeight: 32, cx: 28, cy: 28, r: 22, stroke: 4, marker: 4 },
  hero: { width: 200, arcHeight: 108, cx: 100, cy: 96, r: 78, stroke: 9, marker: 8 },
};

function GaugeArcs({
  cfg,
  score,
  band,
  showZones,
}: {
  cfg: (typeof GAUGE_CONFIG)['compact'];
  score: number;
  band: RiskBand;
  showZones: boolean;
}) {
  const meta = riskBandMeta(band);
  const marker = polar(cfg.cx, cfg.cy, cfg.r, score);

  return (
    <svg
      viewBox={`0 0 ${cfg.width} ${cfg.arcHeight}`}
      className="w-full overflow-visible"
      style={{ height: cfg.arcHeight, maxWidth: cfg.width }}
      role="presentation"
    >
      <path
        d={arcPath(cfg.cx, cfg.cy, cfg.r, 0, 100)}
        fill="none"
        stroke="var(--color-outline-variant)"
        strokeWidth={cfg.stroke}
        strokeLinecap="round"
        opacity={0.3}
      />

      {showZones
        ? BAND_ARCS.map((zone) => {
            const zoneMeta = riskBandMeta(zone.band);
            return (
              <path
                key={zone.band}
                d={arcPath(cfg.cx, cfg.cy, cfg.r, zone.start, zone.end)}
                fill="none"
                stroke={zoneMeta.color}
                strokeWidth={cfg.stroke}
                strokeLinecap="butt"
                opacity={zone.band === band ? 0.85 : 0.22}
              />
            );
          })
        : null}

      {score > 0 ? (
        <path
          d={arcPath(cfg.cx, cfg.cy, cfg.r, 0, score)}
          fill="none"
          stroke={meta.color}
          strokeWidth={cfg.stroke + 1}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      ) : null}

      <circle
        cx={marker.x}
        cy={marker.y}
        r={cfg.marker}
        fill="var(--color-surface-container-lowest)"
        stroke={meta.color}
        strokeWidth={2}
        className="transition-all duration-500 ease-out"
      />
      <circle cx={marker.x} cy={marker.y} r={cfg.marker * 0.42} fill={meta.color} />
    </svg>
  );
}

export function RiskScoreGauge({
  score,
  band,
  size = 'compact',
  pulse,
}: {
  score: number;
  band: RiskBand;
  size?: GaugeSize;
  pulse?: 'up' | 'down' | null;
}) {
  const cfg = GAUGE_CONFIG[size];
  const meta = riskBandMeta(band);

  if (size === 'hero') {
    return (
      <div
        className={`flex w-full max-w-[12.5rem] flex-col items-center ${pulse ? 'risk-score-pulse' : ''}`}
        aria-hidden
      >
        <GaugeArcs cfg={cfg} score={score} band={band} showZones />
        <div className="mt-1 text-center">
          <p className={`text-[3.25rem] font-semibold leading-none tabular-nums tracking-tight ${meta.textClass}`}>
            {score}
          </p>
          <p className="mt-1 text-label-sm font-medium text-on-surface-variant">out of 100</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 ${pulse ? 'risk-score-pulse' : ''}`}
      style={{ width: cfg.width, height: cfg.arcHeight }}
      aria-hidden
    >
      <GaugeArcs cfg={cfg} score={score} band={band} showZones={false} />
    </div>
  );
}
