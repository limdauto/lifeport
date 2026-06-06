/** Report section visual system (domain colors, icons, layout tokens). */

import type { LivingFieldGroup } from '@/lib/fieldDefs';

export type ReportDomain =
  | 'visa'
  | 'banking'
  | 'tax'
  | 'housing'
  | 'health'
  | 'family'
  | 'documents'
  | 'logistics'
  | 'general';

export const DOMAIN_META: Record<
  ReportDomain,
  { label: string; icon: string; colorClass: string; borderClass: string; fill?: boolean }
> = {
  visa: {
    label: 'Visa',
    icon: 'assignment_ind',
    colorClass: 'text-primary',
    borderClass: 'border-l-primary',
  },
  banking: {
    label: 'Banking',
    icon: 'account_balance',
    colorClass: 'text-primary-container',
    borderClass: 'border-l-primary-container',
  },
  tax: {
    label: 'Tax',
    icon: 'payments',
    colorClass: 'text-error',
    borderClass: 'border-l-error',
    fill: true,
  },
  housing: {
    label: 'Housing',
    icon: 'home',
    colorClass: 'text-tertiary',
    borderClass: 'border-l-tertiary',
  },
  health: {
    label: 'Health',
    icon: 'medical_services',
    colorClass: 'text-tertiary',
    borderClass: 'border-l-tertiary',
  },
  family: {
    label: 'Family',
    icon: 'family_restroom',
    colorClass: 'text-secondary',
    borderClass: 'border-l-secondary',
  },
  documents: {
    label: 'Documents',
    icon: 'description',
    colorClass: 'text-primary',
    borderClass: 'border-l-primary',
  },
  logistics: {
    label: 'Logistics',
    icon: 'local_shipping',
    colorClass: 'text-outline',
    borderClass: 'border-l-outline',
  },
  general: {
    label: 'General',
    icon: 'article',
    colorClass: 'text-on-surface-variant',
    borderClass: 'border-l-outline-variant',
  },
};

/** One distinct Material Symbol per report section key. */
const SECTION_ICONS: Record<string, string> = {
  executive_brief: 'summarize',
  move_profile: 'person_pin',
  move_summary: 'clipboard_person',
  hidden_dependencies: 'account_tree',
  risk_map: 'crisis_alert',
  timeline: 'schedule',
  uk_departure_admin: 'flight_takeoff',
  tax_residence: 'calculate',
  hmrc_self_assessment_p85: 'receipt_long',
  uae_residency_emirates_id: 'badge',
  visa_admin: 'assignment_ind',
  visa_admin_evisa_share_codes: 'qr_code_2',
  student_visa_cas_evisa: 'school',
  work_payroll_ni_tax_code: 'work_history',
  banking_money: 'account_balance',
  banking_money_parent_funding: 'currency_exchange',
  housing: 'cottage',
  housing_ejari_utilities: 'apartment',
  housing_right_to_rent_utilities: 'key',
  accommodation_housing: 'bed',
  healthcare: 'medical_services',
  healthcare_insurance: 'health_and_safety',
  healthcare_gp_nhs_insurance: 'local_hospital',
  healthcare_gp_wellbeing: 'self_improvement',
  family: 'family_restroom',
  family_school_dependants: 'groups',
  family_school_nursery_dependants: 'child_care',
  family_parent_communication: 'forum',
  pets_animal_travel: 'pets',
  credentials_licences_attestation: 'verified_user',
  credentials_licences_conversion: 'license',
  documents_credentials: 'folder_open',
  documents_family_records: 'family_history',
  documents_credentials_attestation: 'fact_check',
  shipping_storage_possessions: 'inventory_2',
  property_pension_investments: 'real_estate_agent',
  estate_wills: 'gavel',
  estate_wills_guardianship: 'shield_person',
  destination_setup: 'pin_drop',
  university_registration: 'cast_for_education',
  student_safety_scams: 'security',
  phone_transport_arrival_basics: 'directions_bus',
  day_one_arrival: 'flight_land',
  first_90_days: 'calendar_month',
  first_week_first_term: 'event_note',
  recommended_packages: 'inventory',
  expert_questions: 'contact_support',
  change_log: 'history',
  top_findings: 'search',
  likely_friction_areas: 'report',
  friction_points: 'error_outline',
  recommended_next_step: 'lightbulb',
  risk_preview: 'speed',
  premium_preview: 'workspace_premium',
};

/** One distinct icon per living-report input group. */
const LIVING_GROUP_ICONS: Record<LivingFieldGroup, string> = {
  tax: 'payments',
  visa: 'assignment_ind',
  housing: 'home',
  banking: 'account_balance',
  family: 'family_restroom',
  health: 'medical_services',
  pets: 'pets',
  documents: 'description',
  logistics: 'local_shipping',
  estate: 'gavel',
  destination: 'explore',
  other: 'tune',
};

/** Icons for intake / setup-need status fields (by field key). */
const FIELD_SETUP_ICONS: Record<string, string> = {
  visaStatus: 'assignment_ind',
  primaryApplicantVisaStatus: 'person_check',
  destinationVisaStatus: 'badge',
  housingStatus: 'home',
  accommodationStatus: 'bed',
  bankingStatus: 'account_balance',
  casStatus: 'school',
  employmentStatus: 'work',
  currentUkTaxResidenceStatus: 'calculate',
  selfAssessmentStatus: 'receipt_long',
  p85Status: 'outbound',
  sa109Status: 'edit_note',
  studentLoanStatus: 'school',
  employerSponsorStatus: 'corporate_fare',
  certificateOfSponsorshipStatus: 'description',
  ukviAccountStatus: 'manage_accounts',
  evisaStatus: 'qr_code_2',
  emiratesIdStatus: 'badge',
  dependantVisaStatus: 'family_restroom',
  studentVisaApplicationStatus: 'school',
  visaDecisionStatus: 'gavel',
  ihsPaymentStatus: 'payments',
  ejariStatus: 'apartment',
  dewaUtilitiesStatus: 'bolt',
  tenancyOrHallsContractStatus: 'key',
  mortgageConsentStatus: 'real_estate_agent',
  nonResidentLandlordSchemeStatus: 'domain',
  ukRentalAgentStatus: 'real_estate_agent',
  tuitionPaymentStatus: 'payments',
  nationalInsuranceNumberStatus: 'pin',
  statePensionNiRecordStatus: 'savings',
  privateMedicalInsuranceStatus: 'health_and_safety',
  petVaccinationMicrochipStatus: 'pets',
  estateWillsGuardianshipStatus: 'shield_person',
  destinationResidenceStatus: 'pin_drop',
  destinationBankingStatus: 'account_balance_wallet',
  destinationHealthcareStatus: 'local_hospital',
  destinationHousingStatus: 'cottage',
};

const SETUP_LABEL_ICONS: Record<string, string> = {
  visa: 'assignment_ind',
  housing: 'home',
  accommodation: 'bed',
  banking: 'account_balance',
  tax: 'payments',
  healthcare: 'medical_services',
  health: 'medical_services',
  insurance: 'health_and_safety',
  ejari: 'apartment',
  dewa: 'bolt',
  utilities: 'bolt',
  emirates_id: 'badge',
  emirates: 'badge',
  evisa: 'qr_code_2',
  ukvi: 'manage_accounts',
  cas: 'school',
  school: 'school',
  nursery: 'child_care',
  family: 'family_restroom',
  dependants: 'groups',
  pets: 'pets',
  documents: 'folder_open',
  attestation: 'fact_check',
  shipping: 'local_shipping',
  storage: 'inventory_2',
  pension: 'savings',
  property: 'real_estate_agent',
  mortgage: 'real_estate_agent',
  payroll: 'work_history',
  ni: 'pin',
  national_insurance: 'pin',
  driving: 'directions_car',
  transport: 'directions_bus',
  phone: 'smartphone',
  sim: 'sim_card',
  tenancy: 'key',
  registration: 'how_to_reg',
  sponsorship: 'corporate_fare',
  guardianship: 'shield_person',
  wills: 'gavel',
};

function normalizeSetupKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function iconFromLabelHints(text: string): string | undefined {
  const normalized = normalizeSetupKey(text);
  if (SETUP_LABEL_ICONS[normalized]) return SETUP_LABEL_ICONS[normalized];

  for (const [hint, icon] of Object.entries(SETUP_LABEL_ICONS)) {
    if (normalized.includes(hint)) return icon;
  }

  return undefined;
}

export function sectionIcon(sectionKey: string): string {
  return SECTION_ICONS[sectionKey] ?? 'article';
}

export function livingGroupIcon(group: LivingFieldGroup): string {
  return LIVING_GROUP_ICONS[group];
}

/** Distinct icon for a setup-need chip (move profile status or intake field). */
export function setupNeedIcon(
  key: string,
  label?: string,
  domain?: ReportDomain,
): string {
  if (FIELD_SETUP_ICONS[key]) return FIELD_SETUP_ICONS[key];

  const normalizedKey = normalizeSetupKey(key);
  if (SETUP_LABEL_ICONS[normalizedKey]) return SETUP_LABEL_ICONS[normalizedKey];

  const fromKey = iconFromLabelHints(key);
  if (fromKey) return fromKey;

  if (label) {
    const fromLabel = iconFromLabelHints(label);
    if (fromLabel) return fromLabel;
  }

  if (domain) return DOMAIN_META[domain].icon;

  return 'pending_actions';
}

export function inferDomain(text: string): ReportDomain {
  const t = text.toLowerCase();
  if (/\b(visa|evisa|ukvi|emirates|cas|sponsor|residence permit|right to work|right to rent)\b/.test(t)) {
    return 'visa';
  }
  if (/\b(bank|banking|payroll|salary|kyc|account|fx|transfer|money)\b/.test(t)) {
    return 'banking';
  }
  if (/\b(tax|hmrc|srt|split-year|p85|sa109|pension|isa|cgT|non-resident)\b/.test(t)) {
    return 'tax';
  }
  if (/\b(housing|ejari|tenancy|rent|lease|dewa|utility|accommodation|halls)\b/.test(t)) {
    return 'housing';
  }
  if (/\b(gp|nhs|health|insurance|medical|prescription|wellbeing)\b/.test(t)) {
    return 'health';
  }
  if (/\b(family|school|nursery|child|dependant|spouse|partner)\b/.test(t)) {
    return 'family';
  }
  if (/\b(document|attestation|apostille|degree|certificate|credential)\b/.test(t)) {
    return 'documents';
  }
  if (/\b(shipping|storage|pet|arrival|transport|phone|sim)\b/.test(t)) {
    return 'logistics';
  }
  return 'general';
}

export function formatStatusLabel(status: string): string {
  if (status === 'dont_know') return "Don't know yet";
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export type SetupStatusTone = {
  label: string;
  pillClass: string;
  iconWrapClass: string;
  barClass: string;
  progress: number;
};

export function setupStatusTone(value: string): SetupStatusTone {
  const key = value.toLowerCase().replace(/\s+/g, '_');

  switch (key) {
    case 'sorted':
      return {
        label: 'Sorted',
        pillClass: 'bg-primary-fixed text-on-primary-fixed',
        iconWrapClass: 'bg-primary-fixed/80 text-primary',
        barClass: 'bg-primary',
        progress: 100,
      };
    case 'in_progress':
      return {
        label: 'In progress',
        pillClass: 'bg-primary-container text-on-primary-container',
        iconWrapClass: 'bg-primary-container/60 text-primary',
        barClass: 'bg-primary-container',
        progress: 55,
      };
    case 'uncertain':
      return {
        label: 'Uncertain',
        pillClass: 'bg-error-container text-on-error-container',
        iconWrapClass: 'bg-error-container/70 text-error',
        barClass: 'bg-error',
        progress: 30,
      };
    case 'dont_know':
      return {
        label: "Don't know yet",
        pillClass: 'bg-tertiary-container text-on-tertiary-container',
        iconWrapClass: 'bg-tertiary-container/70 text-tertiary',
        barClass: 'bg-tertiary',
        progress: 8,
      };
    case 'not_started':
    default:
      return {
        label: 'Not started',
        pillClass: 'bg-secondary-container text-on-secondary-container',
        iconWrapClass: 'bg-secondary-container/80 text-on-secondary-container',
        barClass: 'bg-outline-variant',
        progress: 12,
      };
  }
}

export function riskPillClass(level?: string): string {
  switch (level) {
    case 'critical':
    case 'high':
      return 'bg-error-container text-on-error-container font-bold';
    case 'medium':
      return 'bg-secondary-container text-on-secondary-container font-bold';
    case 'low':
      return 'bg-primary-fixed text-on-primary-fixed font-bold';
    default:
      return 'bg-surface-container text-on-surface-variant';
  }
}

export function riskPillLabel(level?: string): string {
  if (!level) return 'Unknown risk';
  return `${level.charAt(0).toUpperCase() + level.slice(1)} risk`;
}

export function isPremiumHeroSection(sectionKey: string): boolean {
  return sectionKey === 'premium_preview';
}

export function isCriticalPathSection(sectionKey: string): boolean {
  return sectionKey === 'hidden_dependencies' || sectionKey === 'student_safety_scams';
}
