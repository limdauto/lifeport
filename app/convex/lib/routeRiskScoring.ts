import type { RouteKey } from './routeConfigs';

/** Per-field risk contribution config — owned by each route's `riskScoring`. */
export type FieldRiskScoreConfig = {
  /** Multiplier on status / empty / yes points. */
  weight?: number;
  /** Override route-level status points for this field. */
  statusPoints?: Partial<Record<string, number>>;
  yesRisk?: number;
  emptyRisk?: number;
  emptyDateRisk?: number;
  dontKnowRisk?: number;
};

export type RouteRiskScoringConfig = {
  /** Starting score before field contributions. */
  baseline?: number;
  /** Default status-value points for select/status fields. */
  statusPoints?: Record<string, number>;
  defaultFieldWeight?: number;
  defaultYesRisk?: number;
  defaultEmptyRisk?: number;
  defaultEmptyDateRisk?: number;
  defaultDontKnowRisk?: number;
  fields: Record<string, FieldRiskScoreConfig>;
};

export const DEFAULT_STATUS_POINTS: Record<string, number> = {
  not_started: 10,
  uncertain: 12,
  dont_know: 8,
  in_progress: 4,
  sorted: 0,
  '': 7,
};

export const DEFAULT_ROUTE_RISK_DEFAULTS = {
  baseline: 24,
  defaultFieldWeight: 1,
  defaultYesRisk: 5,
  defaultEmptyRisk: 4,
  defaultEmptyDateRisk: 12,
  defaultDontKnowRisk: 5,
  statusPoints: DEFAULT_STATUS_POINTS,
} as const;

const SKIPPED_FIELD_KEYS = new Set(['email', 'name', 'originCountry', 'destinationCountry']);

function inferFieldRisk(key: string): FieldRiskScoreConfig {
  if (key === 'moveDate' || key === 'workStartDate' || key === 'courseStartDate') {
    return { weight: 1.6, emptyDateRisk: 12 };
  }
  if (key.includes('Status') || key.endsWith('Status')) {
    return { weight: 1.2 };
  }
  if (
    key.startsWith('has') ||
    key.startsWith('owns') ||
    key === 'partnerMoving' ||
    key === 'parentInvolved'
  ) {
    return { weight: 1, yesRisk: 5 };
  }
  if (key === 'biggestWorry' || key === 'topConcerns') {
    return { weight: 0.8, emptyRisk: 3 };
  }
  return { weight: 1 };
}

/** Build route-owned scoring for all profile fields, with optional per-field overrides. */
export function buildRouteRiskScoring(
  fieldKeys: string[],
  overrides: Record<string, FieldRiskScoreConfig> = {},
): RouteRiskScoringConfig {
  const fields: Record<string, FieldRiskScoreConfig> = {};
  for (const key of fieldKeys) {
    if (SKIPPED_FIELD_KEYS.has(key)) continue;
    fields[key] = { ...inferFieldRisk(key), ...overrides[key] };
  }
  return {
    ...DEFAULT_ROUTE_RISK_DEFAULTS,
    fields,
  };
}

const UK_TO_DUBAI_OVERRIDES: Record<string, FieldRiskScoreConfig> = {
  visaStatus: { weight: 1.5 },
  housingStatus: { weight: 1.4 },
  bankingStatus: { weight: 1.45 },
  moveDate: { weight: 1.6, emptyDateRisk: 12 },
  ownsUkProperty: { weight: 1, yesRisk: 7 },
  hasUkPensionIsaInvestments: { weight: 1, yesRisk: 8 },
  hasPets: { weight: 1, yesRisk: 5 },
  hasChildren: { weight: 1, yesRisk: 4 },
  emiratesIdStatus: { weight: 1.25 },
  ejariStatus: { weight: 1.2 },
  dewaUtilitiesStatus: { weight: 1.1 },
  p85Status: { weight: 1.15 },
  sa109Status: { weight: 1.15 },
  selfAssessmentStatus: { weight: 1.1 },
  healthInsuranceStatusUae: { weight: 1.1 },
  documentsNeedingAttestation: { weight: 1.05, emptyRisk: 5 },
  currentUkTaxResidenceStatus: { weight: 1.2 },
  uaeVisaRoute: { weight: 1.15, emptyRisk: 5 },
};

const PROFESSIONALS_TO_UK_OVERRIDES: Record<string, FieldRiskScoreConfig> = {
  visaStatus: { weight: 1.5 },
  housingStatus: { weight: 1.4 },
  bankingStatus: { weight: 1.45 },
  moveDate: { weight: 1.55, emptyDateRisk: 12 },
  workStartDate: { weight: 1.4, emptyDateRisk: 10 },
  evisaStatus: { weight: 1.3 },
  rightToWorkReadiness: { weight: 1.25 },
  rightToRentReadiness: { weight: 1.2 },
  nationalInsuranceNumberStatus: { weight: 1.15 },
  certificateOfSponsorshipStatus: { weight: 1.3 },
  hasChildren: { weight: 1, yesRisk: 4 },
  hasPets: { weight: 1, yesRisk: 5 },
};

const STUDENTS_TO_UK_OVERRIDES: Record<string, FieldRiskScoreConfig> = {
  visaStatus: { weight: 1.5 },
  housingStatus: { weight: 1.35 },
  bankingStatus: { weight: 1.4 },
  casStatus: { weight: 1.45 },
  studentVisaApplicationStatus: { weight: 1.4 },
  moveDate: { weight: 1.5, emptyDateRisk: 12 },
  courseStartDate: { weight: 1.35, emptyDateRisk: 10 },
  arrivalDateTime: { weight: 1.2, emptyRisk: 6 },
  tuitionPaymentStatus: { weight: 1.2 },
  parentInvolved: { weight: 1, yesRisk: 3 },
};

const FAMILIES_TO_UK_OVERRIDES: Record<string, FieldRiskScoreConfig> = {
  visaStatus: { weight: 1.5 },
  primaryApplicantVisaStatus: { weight: 1.5 },
  housingStatus: { weight: 1.45 },
  bankingStatus: { weight: 1.4 },
  moveDate: { weight: 1.55, emptyDateRisk: 12 },
  dependantVisaStatus: { weight: 1.35 },
  schoolOrNurseryNeeds: { weight: 1.1, emptyRisk: 5 },
  hasChildren: { weight: 1, yesRisk: 5 },
  hasPets: { weight: 1, yesRisk: 5 },
};

const LEAVING_UK_OVERRIDES: Record<string, FieldRiskScoreConfig> = {
  visaStatus: { weight: 1.3 },
  housingStatus: { weight: 1.3 },
  bankingStatus: { weight: 1.35 },
  moveDate: { weight: 1.6, emptyDateRisk: 12 },
  ownsUkProperty: { weight: 1, yesRisk: 7 },
  hasUkProperty: { weight: 1, yesRisk: 7 },
  hasUkPensionIsaInvestments: { weight: 1, yesRisk: 8 },
  p85Status: { weight: 1.2 },
  sa109Status: { weight: 1.2 },
  selfAssessmentStatus: { weight: 1.15 },
  destinationVisaStatus: { weight: 1.35 },
};

const ROUTE_RISK_OVERRIDES: Record<RouteKey, Record<string, FieldRiskScoreConfig>> = {
  uk_to_dubai: UK_TO_DUBAI_OVERRIDES,
  professionals_to_uk: PROFESSIONALS_TO_UK_OVERRIDES,
  students_to_uk: STUDENTS_TO_UK_OVERRIDES,
  families_to_uk: FAMILIES_TO_UK_OVERRIDES,
  leaving_uk: LEAVING_UK_OVERRIDES,
};

export function riskScoringForRoute(
  routeKey: RouteKey,
  checkFields: string[],
  livingReportFields: string[],
): RouteRiskScoringConfig {
  const keys = [...new Set([...checkFields, ...livingReportFields])];
  return buildRouteRiskScoring(keys, ROUTE_RISK_OVERRIDES[routeKey]);
}
