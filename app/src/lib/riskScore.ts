import { DONT_KNOW_VALUE, type FieldDef, type LivingFieldGroup } from '@/lib/fieldDefs';
import type { ReportDomain } from '@/lib/reportDesign';
import {
  DEFAULT_ROUTE_RISK_DEFAULTS,
  type RouteRiskScoringConfig,
} from '../../convex/lib/routeRiskScoring';

export type { FieldRiskScoreConfig, RouteRiskScoringConfig } from '../../convex/lib/routeRiskScoring';

export type RiskBand = 'low' | 'moderate' | 'elevated' | 'high';

export type RiskScoreResult = {
  score: number;
  band: RiskBand;
  bandLabel: string;
  fieldImpacts: Record<string, number>;
  groupImpacts: Record<LivingFieldGroup, number>;
};

export const LIVING_GROUP_DOMAIN: Record<LivingFieldGroup, ReportDomain> = {
  tax: 'tax',
  visa: 'visa',
  housing: 'housing',
  banking: 'banking',
  family: 'family',
  health: 'health',
  pets: 'general',
  documents: 'documents',
  logistics: 'logistics',
  estate: 'tax',
  destination: 'visa',
  other: 'general',
};

function isStatusSelect(field: FieldDef): boolean {
  return (
    field.type === 'select' &&
    !!field.options?.some((o) => o.value === DONT_KNOW_VALUE || o.value === 'not_started')
  );
}

function isYesNoSelect(field: FieldDef): boolean {
  return field.type === 'select' && !!field.options?.some((o) => o.value === 'yes');
}

function fieldConfig(
  scoring: RouteRiskScoringConfig | undefined,
  fieldKey: string,
): RouteRiskScoringConfig['fields'][string] {
  const defaults = scoring ?? { fields: {} };
  return {
    weight: defaults.defaultFieldWeight ?? DEFAULT_ROUTE_RISK_DEFAULTS.defaultFieldWeight,
    ...defaults.fields[fieldKey],
  };
}

function statusPointsFor(
  scoring: RouteRiskScoringConfig | undefined,
  fieldKey: string,
  value: string,
): number {
  const cfg = fieldConfig(scoring, fieldKey);
  const routeStatus = scoring?.statusPoints ?? DEFAULT_ROUTE_RISK_DEFAULTS.statusPoints;
  const merged = { ...routeStatus, ...cfg.statusPoints };
  return merged[value] ?? (value ? 3 : (merged[''] ?? 7));
}

/** Points this field adds to move risk (higher = worse). */
export function fieldRiskPoints(
  field: FieldDef,
  value: string | undefined,
  scoring?: RouteRiskScoringConfig,
): number {
  const v = value?.trim() ?? '';
  const cfg = fieldConfig(scoring, field.key);
  const weight = cfg.weight ?? DEFAULT_ROUTE_RISK_DEFAULTS.defaultFieldWeight;

  if (isStatusSelect(field)) {
    return Math.round(statusPointsFor(scoring, field.key, v) * weight);
  }

  if (isYesNoSelect(field)) {
    if (v === 'yes') {
      return Math.round(
        (cfg.yesRisk ?? scoring?.defaultYesRisk ?? DEFAULT_ROUTE_RISK_DEFAULTS.defaultYesRisk) * weight,
      );
    }
    if (v === DONT_KNOW_VALUE) {
      return Math.round(
        (cfg.dontKnowRisk ??
          scoring?.defaultDontKnowRisk ??
          DEFAULT_ROUTE_RISK_DEFAULTS.defaultDontKnowRisk) * weight,
      );
    }
    return 0;
  }

  if (field.type === 'date') {
    return v
      ? 0
      : Math.round(
          (cfg.emptyDateRisk ??
            scoring?.defaultEmptyDateRisk ??
            DEFAULT_ROUTE_RISK_DEFAULTS.defaultEmptyDateRisk) * weight,
        );
  }

  if (!v) {
    return Math.round(
      (cfg.emptyRisk ?? scoring?.defaultEmptyRisk ?? DEFAULT_ROUTE_RISK_DEFAULTS.defaultEmptyRisk) *
        weight,
    );
  }
  if (v === DONT_KNOW_VALUE) {
    return Math.round(
      (cfg.dontKnowRisk ??
        scoring?.defaultDontKnowRisk ??
        DEFAULT_ROUTE_RISK_DEFAULTS.defaultDontKnowRisk) * weight,
    );
  }
  return 0;
}

function riskBand(score: number): { band: RiskBand; bandLabel: string } {
  if (score < 35) return { band: 'low', bandLabel: 'Low risk' };
  if (score < 55) return { band: 'moderate', bandLabel: 'Moderate risk' };
  if (score < 75) return { band: 'elevated', bandLabel: 'Elevated risk' };
  return { band: 'high', bandLabel: 'High risk' };
}

export function computeRiskScore(
  values: Record<string, string>,
  fields: FieldDef[],
  scoring?: RouteRiskScoringConfig,
): RiskScoreResult {
  const fieldImpacts: Record<string, number> = {};
  const groupImpacts = {} as Record<LivingFieldGroup, number>;

  let total = scoring?.baseline ?? DEFAULT_ROUTE_RISK_DEFAULTS.baseline;

  for (const field of fields) {
    const pts = fieldRiskPoints(field, values[field.key], scoring);
    fieldImpacts[field.key] = pts;
    total += pts;

    const group = field.group ?? 'other';
    groupImpacts[group] = (groupImpacts[group] ?? 0) + pts;
  }

  const score = Math.min(100, Math.max(0, Math.round(total)));
  const { band, bandLabel } = riskBand(score);

  return { score, band, bandLabel, fieldImpacts, groupImpacts };
}

export function sortGroupsByRiskImpact<T extends { group: LivingFieldGroup }>(
  groups: T[],
  groupImpacts: Record<LivingFieldGroup, number>,
): T[] {
  return [...groups].sort((a, b) => {
    const diff = (groupImpacts[b.group] ?? 0) - (groupImpacts[a.group] ?? 0);
    if (diff !== 0) return diff;
    return groups.indexOf(a) - groups.indexOf(b);
  });
}

export type RiskBandMeta = {
  label: string;
  shortLabel: string;
  range: string;
  rangeStart: number;
  rangeEnd: number;
  hint: string;
  color: string;
  containerColor: string;
  textClass: string;
  containerClass: string;
  strokeClass: string;
  meterClass: string;
};

export const RISK_BANDS: RiskBandMeta[] = [
  {
    label: 'Low risk',
    shortLabel: 'Low',
    range: '0–34',
    rangeStart: 0,
    rangeEnd: 34,
    hint: 'Your move looks well covered so far.',
    color: 'var(--color-risk-low)',
    containerColor: 'var(--color-risk-low-container)',
    textClass: 'text-risk-low',
    containerClass: 'bg-risk-low-container',
    strokeClass: 'stroke-risk-low',
    meterClass: 'bg-risk-low',
  },
  {
    label: 'Moderate risk',
    shortLabel: 'Moderate',
    range: '35–54',
    rangeStart: 35,
    rangeEnd: 54,
    hint: 'A few gaps remain — filling inputs will sharpen your plan.',
    color: 'var(--color-risk-moderate)',
    containerColor: 'var(--color-risk-moderate-container)',
    textClass: 'text-risk-moderate',
    containerClass: 'bg-risk-moderate-container',
    strokeClass: 'stroke-risk-moderate',
    meterClass: 'bg-risk-moderate',
  },
  {
    label: 'Elevated risk',
    shortLabel: 'Elevated',
    range: '55–74',
    rangeStart: 55,
    rangeEnd: 74,
    hint: 'Several dependencies are still open — prioritise high-impact sections.',
    color: 'var(--color-risk-elevated)',
    containerColor: 'var(--color-risk-elevated-container)',
    textClass: 'text-risk-elevated',
    containerClass: 'bg-risk-elevated-container',
    strokeClass: 'stroke-risk-elevated',
    meterClass: 'bg-risk-elevated',
  },
  {
    label: 'High risk',
    shortLabel: 'High',
    range: '75+',
    rangeStart: 75,
    rangeEnd: 100,
    hint: 'Critical gaps detected — complete your profile to reduce surprises.',
    color: 'var(--color-risk-high)',
    containerColor: 'var(--color-risk-high-container)',
    textClass: 'text-risk-high',
    containerClass: 'bg-risk-high-container',
    strokeClass: 'stroke-risk-high',
    meterClass: 'bg-risk-high',
  },
];

export function riskBandMeta(band: RiskBand): RiskBandMeta {
  return RISK_BANDS.find((b) => b.shortLabel.toLowerCase() === band) ?? RISK_BANDS[1];
}

export function riskBandColor(band: RiskBand): string {
  return riskBandMeta(band).textClass;
}

export function riskBandMeterClass(band: RiskBand): string {
  return riskBandMeta(band).meterClass;
}

export function riskBandStrokeClass(band: RiskBand): string {
  return riskBandMeta(band).strokeClass;
}
