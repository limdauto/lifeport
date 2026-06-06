import type { LivingFieldGroup } from '@/lib/fieldDefs';

export type GlossaryTerm = { label: string; text: string };

export const LIVING_GROUP_INTROS: Record<LivingFieldGroup, string> = {
  tax: 'UK exit timing, residence tests, HMRC forms, and how your move date affects tax reporting.',
  visa: 'Immigration status, digital visas, employer sponsorship, and right-to-work or residence proof.',
  housing: 'Where you will live, tenancy paperwork, address proof, and utility setup.',
  banking: 'Bank accounts, salary routing, proof-of-funds, pensions, and cross-border money.',
  family: 'Partner, children, schools, dependants, and documents for the household move.',
  health: 'Health insurance, GP registration, prescriptions, and ongoing care.',
  pets: 'Pet travel, vaccinations, import rules, and pet-friendly housing timing.',
  documents: 'Certificates, translations, apostille, and attestation before and after the move.',
  logistics: 'Arrival, phone/SIM, transport, shipping, storage, and first weeks abroad.',
  estate: 'Wills, guardianship, beneficiaries, and advisers already involved.',
  destination: 'Setup in your new country when leaving the UK (visa, banking, housing abroad).',
  other: 'Anything else that shapes your move profile.',
};

/** What to fill in — shown in the section ⓘ tooltip on profile wizards. */
export const LIVING_GROUP_GUIDANCE: Record<LivingFieldGroup, string> = {
  tax:
    'Share your current UK tax residence picture, expected UK days after the move, and whether P85, SA109, or Self Assessment apply. Estimates are fine — this helps time your UK exit against departure and flag split-year or SRT issues.',
  visa:
    'Describe your visa route, sponsor or employer progress, and digital status (eVisa, UKVI account, Emirates ID). Note dependant visas if family are joining. “Not started” is useful — it tells us what is still blocking banking and housing.',
  housing:
    'Outline your housing plan, interim accommodation, and status of tenancy paperwork (Ejari in Dubai, right-to-rent in the UK). Mention budget and whether you still need proof-of-address for a bank or school letter.',
  banking:
    'List current accounts, how salary and rent will be paid, and any ISA, pension, or investment accounts that continue after the move. Flag source-of-funds complexity if banks may ask extra questions.',
  family:
    'Cover who is moving with you, children’s ages, school or nursery needs, and spouse or partner work plans. Include custody or consent documents if relevant — family timing often drives housing location.',
  health:
    'Note health insurance status, GP registration plans, ongoing prescriptions, and any disability or wellbeing support. UAE residence usually requires valid medical insurance; UK arrival needs GP registration once you have an address.',
  pets:
    'Describe species, number of pets, vaccination and microchip status, and whether import permits are started. Pet timelines can affect when you sign a tenancy or book travel.',
  documents:
    'List certificates that may need apostille, translation, or UAE attestation — degrees, marriage and birth records, school transcripts, professional licences. Flag anything you still need to collect before departure.',
  logistics:
    'Cover arrival timing, phone or SIM plans, shipping and storage, driving licence needs, and mail forwarding. Useful for day-one setup and what to arrange before you land.',
  estate:
    'Mention existing wills, guardianship arrangements, and any tax or estate advisers already engaged. Cross-border moves often need beneficiary and guardianship review when dependants are involved.',
  destination:
    'If you are leaving the UK, describe destination visa, banking, healthcare, and housing setup abroad. This runs in parallel with UK departure admin — rough status on each area is enough.',
  other:
    'Add move facts that do not fit elsewhere — employment changes, concerns from your Lifeport Check, or anything that might affect sequencing. Skip if nothing else applies.',
};

export const CHECK_STEP_GUIDANCE: Record<string, string> = {
  contact:
    'Enter the name and email you want on your report. We use these to save your check and send your results — nothing is sold to third parties.',
  move:
    'Tell us origin, destination, rough move date, household type, and reason for moving. Approximate dates and “not sure yet” answers still produce a useful first check.',
  status:
    'Mark progress on visa, housing, and banking (not started is fine). Flag UK property, pensions, children, pets, and your biggest worry — these steer which friction areas we highlight first.',
};

export const LIVING_GROUP_TERMS: Partial<Record<LivingFieldGroup, GlossaryTerm[]>> = {
  tax: [
    { label: 'SRT', text: 'Statutory Residence Test — UK rules that decide if you are UK tax resident based on days and ties.' },
    { label: 'Split-year', text: 'Tax treatment that may split one tax year between UK and overseas residence.' },
    { label: 'P85', text: 'HMRC form used when leaving the UK to claim any UK tax refund on employment income.' },
    { label: 'SA109', text: 'Self Assessment supplementary page for split-year or residence claims.' },
  ],
  visa: [
    { label: 'eVisa', text: 'Your UK immigration status is now digital — accessed via a UKVI account, not a physical BRP.' },
    { label: 'UKVI account', text: 'UK Visas and Immigration online account where you view and share immigration status.' },
    { label: 'Share code', text: 'Short code employers and landlords use to verify your right to work or rent in the UK.' },
    { label: 'Emirates ID', text: 'UAE identity card — needed for banking, tenancy (Ejari), and most local admin.' },
    { label: 'CAS', text: 'Confirmation of Acceptance for Studies — university document required for a UK Student visa.' },
    { label: 'IHS', text: 'Immigration Health Surcharge — fee that funds NHS access on many UK visa routes.' },
    { label: 'CoS', text: 'Certificate of Sponsorship — employer document for UK work visa applications.' },
  ],
  housing: [
    { label: 'Ejari', text: 'Official Dubai tenancy registration with the Land Department — often required for banking and schools.' },
    { label: 'DEWA', text: 'Dubai Electricity & Water Authority — utility account for your home after Ejari.' },
    { label: 'Right to rent', text: 'UK check that landlords must complete before letting to you — usually via a share code.' },
    { label: 'Proof of address', text: 'Bank and GP registration often need a tenancy, utility bill, or employer letter with your address.' },
    { label: 'NRLS', text: 'Non-Resident Landlord Scheme — UK tax withholding if you rent out UK property while abroad.' },
  ],
  banking: [
    { label: 'KYC', text: 'Know Your Customer checks — banks verify identity, immigration status, and source of funds.' },
    { label: 'ISA', text: 'UK Individual Savings Account — contribution rules usually change once you are non-UK resident.' },
    { label: 'SIPP', text: 'Self-invested personal pension — cross-border rules may limit contributions after departure.' },
    { label: 'NI number', text: 'UK National Insurance number — needed for payroll and state pension record.' },
  ],
  family: [
    { label: 'Dependant visa', text: 'Immigration status for a partner or child linked to the main applicant’s route.' },
    { label: 'Catchment', text: 'School admission area tied to your home address — often drives where you rent.' },
  ],
  health: [
    { label: 'GP', text: 'General Practitioner — your primary NHS doctor in the UK; registration needs an address.' },
    { label: 'NHS', text: 'UK National Health Service — access on many visa routes after IHS and registration.' },
  ],
  documents: [
    { label: 'Apostille', text: 'International certification of a UK document so it is recognised abroad.' },
    { label: 'Attestation', text: 'UAE MOFA or embassy verification of foreign documents for visa, bank, or school use.' },
    { label: 'MOFA', text: 'UAE Ministry of Foreign Affairs — attests documents for official use in the Emirates.' },
  ],
  logistics: [
    { label: 'eSIM', text: 'Digital SIM activated by QR code — useful for ride-hailing, banking OTPs, and maps on arrival day.' },
    { label: 'MOCCAE', text: 'UAE ministry handling pet import permits and animal travel rules.' },
  ],
  estate: [
    { label: 'Guardianship', text: 'Legal arrangements for children if parents are unavailable — especially important cross-border.' },
  ],
};

/** Field-level tooltip when a term is not covered by the group glossary. */
export const FIELD_GLOSSARY: Record<string, string> = {
  ejariStatus:
    'Ejari registers your Dubai lease with the government. Banks and schools often ask for Ejari as proof of address.',
  dewaUtilitiesStatus:
    'DEWA is the Dubai utility provider. An account is usually opened after Ejari is completed.',
  emiratesIdStatus:
    'Emirates ID is the UAE national ID card. It is central to payroll, banking, and residence admin.',
  evisaStatus: 'Your immigration permission stored digitally — create a UKVI account before travel to the UK.',
  ukviAccountStatus: 'Online account to access your UK eVisa and generate share codes.',
  ihsPaymentStatus: 'Immigration Health Surcharge payment — required for NHS access on eligible UK visas.',
  casStatus: 'Confirmation of Acceptance for Studies from your university — needed before a Student visa application.',
  certificateOfSponsorshipStatus: 'Employer-issued Certificate of Sponsorship for UK Skilled Worker and similar routes.',
  rightToWorkReadiness: 'Whether you can prove the right to work — employers usually verify via a share code.',
  rightToRentReadiness: 'Whether a landlord can verify your right to rent in England before signing a tenancy.',
  nonResidentLandlordSchemeStatus:
    'If you rent UK property while non-resident, tax may be withheld unless you register with HMRC.',
  p85Status: 'Form P85 tells HMRC you are leaving the UK and may trigger a tax refund on UK employment income.',
  sa109Status: 'SA109 supports split-year or residence claims on your UK Self Assessment return.',
  selfAssessmentStatus: 'UK Self Assessment — annual tax return if you have UK income or need to claim split-year treatment.',
  healthInsuranceStatusUae: 'Valid health insurance is typically required for UAE residence visa issuance.',
  studentBankLetterAvailability:
    'Universities issue a bank introduction letter — often required to open a UK student account.',
  documentsNeedingAttestation:
    'Documents such as degrees or marriage certificates may need UK apostille and UAE MOFA attestation.',
  petVaccinationMicrochipStatus: 'UAE pet import usually requires microchip, vaccinations, and an import permit.',
  ukPhoneNumber2faPlan:
    'Many UK banks and apps use SMS 2FA — plan how you will receive codes if your UK number changes.',
  expectedUkDaysAfterMove: 'Days spent in the UK after moving affect the Statutory Residence Test.',
  uaeVisaRoute: 'Your UAE residence pathway — e.g. employment visa, golden visa, partner visa, or freelance permit.',
};

export function fieldGlossaryText(key: string, fieldHint?: string): string | undefined {
  return FIELD_GLOSSARY[key] ?? fieldHint;
}

export function groupTermsFor(group: LivingFieldGroup): GlossaryTerm[] {
  return LIVING_GROUP_TERMS[group] ?? [];
}

export function groupGuidanceFor(group: LivingFieldGroup): string {
  return LIVING_GROUP_GUIDANCE[group];
}

export function checkStepGuidance(stepKey: string): string | undefined {
  return CHECK_STEP_GUIDANCE[stepKey];
}
