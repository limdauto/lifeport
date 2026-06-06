export type SectionCategory =
  | 'overview'
  | 'critical'
  | 'timeline'
  | 'immigration'
  | 'money'
  | 'home'
  | 'health'
  | 'family'
  | 'documents'
  | 'logistics'
  | 'meta';

export type SectionMeta = {
  category: SectionCategory;
  categoryLabel: string;
  accentClass: string;
  defaultOpen: boolean;
};

const CATEGORY_LABELS: Record<SectionCategory, string> = {
  overview: 'Overview',
  critical: 'Critical path',
  timeline: 'Timeline',
  immigration: 'Visa & admin',
  money: 'Banking & tax',
  home: 'Housing',
  health: 'Healthcare',
  family: 'Family',
  documents: 'Documents',
  logistics: 'Logistics',
  meta: 'Reference',
};

const BY_KEY: Partial<Record<string, SectionCategory>> = {
  executive_brief: 'overview',
  move_profile: 'overview',
  risk_map: 'critical',
  hidden_dependencies: 'critical',
  timeline: 'timeline',
  first_90_days: 'timeline',
  day_one_arrival: 'logistics',
  first_week_first_term: 'timeline',
  uk_departure_admin: 'immigration',
  visa_admin_evisa_share_codes: 'immigration',
  student_visa_cas_evisa: 'immigration',
  uae_residency_emirates_id: 'immigration',
  destination_setup: 'immigration',
  tax_residence: 'money',
  hmrc_self_assessment_p85: 'money',
  work_payroll_ni_tax_code: 'money',
  banking_money: 'money',
  banking_money_parent_funding: 'money',
  property_pension_investments: 'money',
  housing_ejari_utilities: 'home',
  housing_right_to_rent_utilities: 'home',
  accommodation_housing: 'home',
  healthcare_insurance: 'health',
  healthcare_gp_nhs_insurance: 'health',
  healthcare_gp_wellbeing: 'health',
  family_school_dependants: 'family',
  family_school_nursery_dependants: 'family',
  family_parent_communication: 'family',
  pets_animal_travel: 'family',
  credentials_licences_attestation: 'documents',
  credentials_licences_conversion: 'documents',
  documents_credentials: 'documents',
  documents_family_records: 'documents',
  documents_credentials_attestation: 'documents',
  shipping_storage_possessions: 'logistics',
  phone_transport_arrival_basics: 'logistics',
  estate_wills_guardianship: 'documents',
  university_registration: 'immigration',
  student_safety_scams: 'critical',
  recommended_packages: 'meta',
  expert_questions: 'meta',
  change_log: 'meta',
  move_summary: 'overview',
  friction_points: 'critical',
  risk_preview: 'critical',
  premium_preview: 'meta',
};

const ACCENT: Record<SectionCategory, string> = {
  overview: 'border-l-primary bg-primary-fixed/15',
  critical: 'border-l-error bg-error-container/25',
  timeline: 'border-l-secondary bg-secondary-container/40',
  immigration: 'border-l-tertiary bg-tertiary-container/30',
  money: 'border-l-primary bg-surface-container-low',
  home: 'border-l-secondary bg-surface-container-low',
  health: 'border-l-tertiary bg-surface-container-low',
  family: 'border-l-secondary bg-surface-container-low',
  documents: 'border-l-outline bg-surface-container-low',
  logistics: 'border-l-outline bg-surface-container-low',
  meta: 'border-l-outline-variant bg-surface-container-low/80',
};

const ALWAYS_OPEN = new Set([
  'executive_brief',
  'hidden_dependencies',
  'risk_map',
  'move_summary',
  'friction_points',
]);

export function sectionMeta(sectionKey: string, riskLevel?: string): SectionMeta {
  const category = BY_KEY[sectionKey] ?? 'meta';
  const highRisk = riskLevel === 'high' || riskLevel === 'critical';
  return {
    category,
    categoryLabel: CATEGORY_LABELS[category],
    accentClass: ACCENT[category],
    defaultOpen: ALWAYS_OPEN.has(sectionKey) || highRisk,
  };
}
