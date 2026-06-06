import type { PackageKey } from './routeConfigs';

export type PackageCatalogEntry = {
  title: string;
  outcome: string;
  priceFrom: number;
};

export const PACKAGE_CATALOG: Record<PackageKey, PackageCatalogEntry> = {
  tax_residence_packet: {
    title: 'Tax Residence Packet',
    outcome: 'UK exit / arrival tax residence review with split-year and SRT prompts',
    priceFrom: 399,
  },
  banking_readiness: {
    title: 'Banking Readiness',
    outcome: 'Document pack, account pathway and proof-of-address sequencing',
    priceFrom: 199,
  },
  documents_attestation_pack: {
    title: 'Documents & Attestation Pack',
    outcome: 'Degree, marriage, birth and school records — apostille / attestation plan',
    priceFrom: 249,
  },
  housing_ejari_readiness: {
    title: 'Housing & Ejari Readiness',
    outcome: 'Tenancy, Ejari, DEWA/utilities and address-evidence sequencing',
    priceFrom: 249,
  },
  housing_readiness: {
    title: 'Housing Readiness',
    outcome: 'Right-to-rent, tenancy, deposit and proof-of-address planning',
    priceFrom: 249,
  },
  healthcare_insurance_setup: {
    title: 'Healthcare & Insurance Setup',
    outcome: 'UAE health insurance, GP continuity and dependant cover',
    priceFrom: 149,
  },
  healthcare_setup: {
    title: 'Healthcare Setup',
    outcome: 'NHS/GP registration, prescriptions and family health records',
    priceFrom: 149,
  },
  family_arrival_pack: {
    title: 'Family Arrival Pack',
    outcome: 'Spouse/child visas, schools, banking and first-month family logistics',
    priceFrom: 349,
  },
  credentials_licences_conversion: {
    title: 'Credentials & Licences Conversion',
    outcome: 'Driving licence, degree comparability and regulated profession checks',
    priceFrom: 199,
  },
  pet_relocation_readiness: {
    title: 'Pet Relocation Readiness',
    outcome: 'Import permits, vaccinations, microchip and pet-friendly housing timing',
    priceFrom: 179,
  },
  storage_shipping_plan: {
    title: 'Storage & Shipping Plan',
    outcome: 'Shipping windows, storage, valuables and first-30-days essentials',
    priceFrom: 299,
  },
  estate_wills_packet: {
    title: 'Estate & Wills Packet',
    outcome: 'Cross-border wills, guardianship and beneficiary review',
    priceFrom: 299,
  },
  first_90_days_concierge: {
    title: 'First 90 Days Concierge',
    outcome: 'Hands-on sequencing for arrival sprint and admin cutover',
    priceFrom: 799,
  },
  day_one_arrival_pack: {
    title: 'Day 1 Arrival Pack',
    outcome: 'eSIM setup, airport-to-door transport, first-night essentials and landing checklist',
    priceFrom: 129,
  },
  school_nursery_setup: {
    title: 'School & Nursery Setup',
    outcome: 'Admissions, catchment, nursery waitlists and year-group mapping',
    priceFrom: 249,
  },
  student_arrival_pack: {
    title: 'Student Arrival Pack',
    outcome: 'CAS/eVisa, university registration, bank letter and arrival week',
    priceFrom: 99,
  },
  student_document_readiness: {
    title: 'Student Document Readiness',
    outcome: 'CAS, visa, transcripts and university record pack',
    priceFrom: 79,
  },
  parent_emergency_pack: {
    title: 'Parent Emergency Pack',
    outcome: 'Funding safety, FX, emergency contacts and scam-avoidance briefing',
    priceFrom: 129,
  },
  safety_scams_pack: {
    title: 'Safety & Scams Pack',
    outcome: 'Arrival safety, fraud patterns and emergency communication plan',
    priceFrom: 49,
  },
  documents_family_records_pack: {
    title: 'Family Records Pack',
    outcome: 'Marriage, birth, custody, school records and translations',
    priceFrom: 199,
  },
  uk_departure_admin_pack: {
    title: 'UK Departure Admin Pack',
    outcome: 'P85, SA109, HMRC, council, mail and address cutover',
    priceFrom: 349,
  },
  banking_continuity: {
    title: 'Banking Continuity',
    outcome: 'UK account continuity, cards, 2FA and overseas address risk',
    priceFrom: 199,
  },
  property_pension_investments_packet: {
    title: 'Property, Pension & Investments Packet',
    outcome: 'UK property, ISA/SIPP, brokers and non-resident reporting',
    priceFrom: 399,
  },
};
