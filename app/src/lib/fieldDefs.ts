export type LivingFieldGroup =
  | 'tax'
  | 'visa'
  | 'housing'
  | 'banking'
  | 'family'
  | 'health'
  | 'pets'
  | 'documents'
  | 'logistics'
  | 'estate'
  | 'destination'
  | 'other';

export const DONT_KNOW_VALUE = 'dont_know';

export type FieldDef = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'email';
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  hint?: string;
  /** Text/textarea: user can flag "don't know yet" for report follow-up. */
  allowDontKnow?: boolean;
  section?: 'contact' | 'move' | 'status' | 'flags' | 'concerns';
  group?: LivingFieldGroup;
};

export const LIVING_GROUP_LABELS: Record<LivingFieldGroup, string> = {
  tax: 'Tax & residence',
  visa: 'Visa & immigration',
  housing: 'Housing & accommodation',
  banking: 'Banking & money',
  family: 'Family & dependants',
  health: 'Health & wellbeing',
  pets: 'Pets',
  documents: 'Documents & credentials',
  logistics: 'Logistics & arrival',
  estate: 'Estate & advisers',
  destination: 'Destination setup',
  other: 'Other details',
};

export const LIVING_GROUP_ORDER: LivingFieldGroup[] = [
  'tax',
  'visa',
  'housing',
  'banking',
  'family',
  'health',
  'pets',
  'documents',
  'logistics',
  'estate',
  'destination',
  'other',
];

const statusOptions = [
  { value: 'not_started', label: 'Not started' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'sorted', label: 'Sorted' },
  { value: 'uncertain', label: 'Uncertain' },
  { value: DONT_KNOW_VALUE, label: "Don't know yet" },
];

const householdOptions = [
  { value: 'alone', label: 'Moving alone' },
  { value: 'partner', label: 'With partner' },
  { value: 'family', label: 'With family' },
  { value: 'student', label: 'Student' },
];

const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: DONT_KNOW_VALUE, label: "Don't know yet" },
];

const status = (key: string, label: string, group: LivingFieldGroup, hint?: string): FieldDef => ({
  key,
  label,
  type: 'select',
  options: statusOptions,
  group,
  hint,
});

const text = (key: string, label: string, group: LivingFieldGroup, placeholder?: string): FieldDef => ({
  key,
  label,
  type: 'text',
  group,
  placeholder,
  allowDontKnow: true,
});

const area = (key: string, label: string, group: LivingFieldGroup, placeholder?: string): FieldDef => ({
  key,
  label,
  type: 'textarea',
  group,
  placeholder,
  allowDontKnow: true,
});

const CHECK_FIELD_DEFS: Record<string, FieldDef> = {
  email: { key: 'email', label: 'Email', type: 'email', required: true, section: 'contact' },
  name: { key: 'name', label: 'Name', type: 'text', required: true, section: 'contact' },
  originCountry: { key: 'originCountry', label: 'Origin country', type: 'text', required: true, section: 'move' },
  destinationCountry: { key: 'destinationCountry', label: 'Destination country', type: 'text', required: true, section: 'move' },
  destinationCity: { key: 'destinationCity', label: 'Destination city', type: 'text', section: 'move', placeholder: 'e.g. Dubai, London' },
  citizenships: { key: 'citizenships', label: 'Citizenship(s)', type: 'text', section: 'move', placeholder: 'e.g. British' },
  moveDate: { key: 'moveDate', label: 'Move date (approx)', type: 'date', section: 'move' },
  moveDateFlexibility: { key: 'moveDateFlexibility', label: 'Move date flexibility', type: 'select', options: yesNo, section: 'move' },
  moveReason: { key: 'moveReason', label: 'Main reason for move', type: 'text', section: 'move', placeholder: 'e.g. work transfer, retirement' },
  workStartDate: { key: 'workStartDate', label: 'Work start date', type: 'date', section: 'move' },
  householdType: { key: 'householdType', label: 'Household', type: 'select', options: householdOptions, section: 'move' },
  hasChildren: { key: 'hasChildren', label: 'Children moving with you?', type: 'select', options: yesNo, section: 'flags' },
  hasPets: { key: 'hasPets', label: 'Pets involved?', type: 'select', options: yesNo, section: 'flags' },
  employmentStatus: { key: 'employmentStatus', label: 'Employment status', type: 'text', section: 'status', placeholder: 'e.g. employed, self-employed' },
  visaStatus: { key: 'visaStatus', label: 'Visa / residence status', type: 'select', options: statusOptions, section: 'status' },
  primaryApplicantVisaStatus: { key: 'primaryApplicantVisaStatus', label: 'Main applicant visa status', type: 'select', options: statusOptions, section: 'status' },
  destinationVisaStatus: { key: 'destinationVisaStatus', label: 'Destination visa status', type: 'select', options: statusOptions, section: 'status' },
  housingStatus: { key: 'housingStatus', label: 'Housing status', type: 'select', options: statusOptions, section: 'status' },
  accommodationStatus: { key: 'accommodationStatus', label: 'Accommodation status', type: 'select', options: statusOptions, section: 'status' },
  bankingStatus: { key: 'bankingStatus', label: 'Banking status', type: 'select', options: statusOptions, section: 'status' },
  employerSupportLevel: {
    key: 'employerSupportLevel',
    label: 'Employer support level',
    type: 'select',
    options: [
      { value: 'full', label: 'Full relocation support' },
      { value: 'partial', label: 'Partial (visa only)' },
      { value: 'none', label: 'None / minimal' },
    ],
    section: 'status',
  },
  ownsUkProperty: { key: 'ownsUkProperty', label: 'Own UK property?', type: 'select', options: yesNo, section: 'flags' },
  hasUkProperty: { key: 'hasUkProperty', label: 'Have UK property?', type: 'select', options: yesNo, section: 'flags' },
  hasUkPensionIsaInvestments: { key: 'hasUkPensionIsaInvestments', label: 'UK pension / ISA / investments?', type: 'select', options: yesNo, section: 'flags' },
  expectedUkDaysAfterMove: { key: 'expectedUkDaysAfterMove', label: 'Expected UK days after move (this year)', type: 'text', section: 'flags', placeholder: 'e.g. 20' },
  previousUkResidence: { key: 'previousUkResidence', label: 'Previously lived in UK?', type: 'select', options: yesNo, section: 'flags' },
  studentAge: { key: 'studentAge', label: 'Your age', type: 'text', section: 'move' },
  university: { key: 'university', label: 'University', type: 'text', section: 'move' },
  courseLevel: { key: 'courseLevel', label: 'Course level', type: 'text', section: 'move', placeholder: 'e.g. undergraduate' },
  courseStartDate: { key: 'courseStartDate', label: 'Course start date', type: 'date', section: 'move' },
  casStatus: { key: 'casStatus', label: 'CAS status', type: 'select', options: statusOptions, section: 'status' },
  parentInvolved: { key: 'parentInvolved', label: 'Parents involved in funding?', type: 'select', options: yesNo, section: 'flags' },
  arrivingAlone: { key: 'arrivingAlone', label: 'Arriving alone?', type: 'select', options: yesNo, section: 'flags' },
  partnerMoving: { key: 'partnerMoving', label: 'Partner moving?', type: 'select', options: yesNo, section: 'flags' },
  childrenAges: { key: 'childrenAges', label: 'Children ages', type: 'text', section: 'flags', placeholder: 'e.g. 4, 7' },
  schoolNeeds: { key: 'schoolNeeds', label: 'School / nursery needs', type: 'textarea', section: 'flags' },
  healthcareConcerns: { key: 'healthcareConcerns', label: 'Healthcare concerns', type: 'textarea', section: 'concerns' },
  dependants: { key: 'dependants', label: 'Dependants', type: 'text', section: 'flags', placeholder: 'e.g. spouse + 2 children' },
  topConcerns: { key: 'topConcerns', label: 'Top concerns', type: 'textarea', section: 'concerns', placeholder: 'e.g. tax exit, banking, schools' },
  biggestWorry: { key: 'biggestWorry', label: 'Biggest worry right now', type: 'textarea', required: true, section: 'concerns' },
};

const LIVING_FIELD_DEFS: Record<string, FieldDef> = {
  currentUkTaxResidenceStatus: status('currentUkTaxResidenceStatus', 'Current UK tax residence status', 'tax'),
  taxResidenceLastFiveYears: area('taxResidenceLastFiveYears', 'Tax residence history (last 5 years)', 'tax', 'Where you were resident and for how long'),
  ukTiesHomeWorkFamily: area('ukTiesHomeWorkFamily', 'UK ties (home, work, family)', 'tax'),
  ukEmploymentOrBusinessAfterMove: area('ukEmploymentOrBusinessAfterMove', 'UK employment or business after move', 'tax'),
  expectedUkDaysCurrentTaxYear: text('expectedUkDaysCurrentTaxYear', 'Expected UK days (current tax year)', 'tax', 'e.g. 45'),
  expectedUkDaysNextTaxYear: text('expectedUkDaysNextTaxYear', 'Expected UK days (next tax year)', 'tax', 'e.g. 10'),
  ukWorkdaysAfterMove: text('ukWorkdaysAfterMove', 'UK workdays after move', 'tax', 'e.g. 30'),
  selfAssessmentStatus: status('selfAssessmentStatus', 'Self Assessment status', 'tax'),
  p85Status: status('p85Status', 'P85 status', 'tax'),
  sa109Status: status('sa109Status', 'SA109 status', 'tax'),
  studentLoanStatus: status('studentLoanStatus', 'Student loan status', 'tax'),
  nationalInsuranceContributionPlans: area('nationalInsuranceContributionPlans', 'National Insurance contribution plans', 'tax'),
  foreignIncomeOrAssets: area('foreignIncomeOrAssets', 'Foreign income or assets', 'tax'),
  propertyAbroad: area('propertyAbroad', 'Property abroad', 'tax'),
  uaeVisaRoute: text('uaeVisaRoute', 'UAE visa route', 'visa', 'e.g. employment, golden visa, partner'),
  visaRoute: text('visaRoute', 'UK visa route', 'visa', 'e.g. Skilled Worker, Global Talent'),
  employerSponsorStatus: status('employerSponsorStatus', 'Employer / sponsor status', 'visa'),
  certificateOfSponsorshipStatus: status('certificateOfSponsorshipStatus', 'Certificate of Sponsorship status', 'visa'),
  ukviAccountStatus: status('ukviAccountStatus', 'UKVI account status', 'visa'),
  evisaStatus: status('evisaStatus', 'eVisa status', 'visa'),
  emiratesIdStatus: status('emiratesIdStatus', 'Emirates ID status', 'visa'),
  rightToWorkReadiness: status('rightToWorkReadiness', 'Right to work readiness', 'visa'),
  rightToRentReadiness: status('rightToRentReadiness', 'Right to rent readiness', 'visa'),
  dependantVisaStatus: status('dependantVisaStatus', 'Dependant visa status', 'visa'),
  primaryApplicantVisaRoute: text('primaryApplicantVisaRoute', 'Main applicant visa route', 'visa'),
  primaryApplicantWorkOrStudyStartDate: { key: 'primaryApplicantWorkOrStudyStartDate', label: 'Main applicant start date', type: 'date', group: 'visa' },
  studentVisaApplicationStatus: status('studentVisaApplicationStatus', 'Student visa application status', 'visa'),
  visaDecisionStatus: status('visaDecisionStatus', 'Visa decision status', 'visa'),
  ihsPaymentStatus: status('ihsPaymentStatus', 'IHS payment status', 'visa'),
  casIssuedDate: { key: 'casIssuedDate', label: 'CAS issued date', type: 'date', group: 'visa' },
  passportExpiryDate: { key: 'passportExpiryDate', label: 'Passport expiry date', type: 'date', group: 'visa' },
  uaeHousingPlan: area('uaeHousingPlan', 'UAE housing plan', 'housing', 'Areas, budget, tenancy type'),
  ejariStatus: status('ejariStatus', 'Ejari status', 'housing'),
  dewaUtilitiesStatus: status('dewaUtilitiesStatus', 'DEWA / utilities status', 'housing'),
  housingBudget: text('housingBudget', 'Housing budget', 'housing', 'e.g. £2,500/month'),
  ukProofOfAddressPlan: area('ukProofOfAddressPlan', 'UK proof-of-address plan', 'housing'),
  accommodationType: text('accommodationType', 'Accommodation type', 'housing', 'e.g. halls, private rent'),
  tenancyOrHallsContractStatus: status('tenancyOrHallsContractStatus', 'Tenancy / halls contract status', 'housing'),
  guarantorOrDepositNeeds: area('guarantorOrDepositNeeds', 'Guarantor or deposit needs', 'housing'),
  proofOfAddressPlan: area('proofOfAddressPlan', 'Proof of address plan', 'housing'),
  temporaryAccommodationNeeds: area('temporaryAccommodationNeeds', 'Temporary accommodation needs', 'housing'),
  ukPropertyDetails: area('ukPropertyDetails', 'UK property details', 'housing'),
  ukPropertyRentalOrSalePlans: area('ukPropertyRentalOrSalePlans', 'UK property rental or sale plans', 'housing'),
  ukPropertySaleOrRentalPlans: area('ukPropertySaleOrRentalPlans', 'UK property sale or rental plans', 'housing'),
  mortgageConsentStatus: status('mortgageConsentStatus', 'Mortgage consent status', 'housing'),
  nonResidentLandlordSchemeStatus: status('nonResidentLandlordSchemeStatus', 'Non-resident landlord scheme status', 'housing'),
  ukRentalAgentStatus: status('ukRentalAgentStatus', 'UK rental agent status', 'housing'),
  bankingNeedsSalaryRentFamilyTransfers: area('bankingNeedsSalaryRentFamilyTransfers', 'Banking needs (salary, rent, family transfers)', 'banking'),
  currentBankAccounts: area('currentBankAccounts', 'Current bank accounts', 'banking'),
  currentBankingSetup: area('currentBankingSetup', 'Current banking setup', 'banking'),
  sourceOfFundsComplexity: area('sourceOfFundsComplexity', 'Source of funds complexity', 'banking'),
  studentBankLetterAvailability: status('studentBankLetterAvailability', 'Student bank letter availability', 'banking'),
  tuitionPaymentStatus: status('tuitionPaymentStatus', 'Tuition payment status', 'banking'),
  rentPaymentPlan: area('rentPaymentPlan', 'Rent payment plan', 'banking'),
  parentFundingPlan: area('parentFundingPlan', 'Parent funding plan', 'banking'),
  fxTransferNeeds: area('fxTransferNeeds', 'FX transfer needs', 'banking'),
  familyBankingNeeds: area('familyBankingNeeds', 'Family banking needs', 'banking'),
  ukBankingContinuityPlan: area('ukBankingContinuityPlan', 'UK banking continuity plan', 'banking'),
  salaryBand: text('salaryBand', 'Salary band', 'banking', 'e.g. £60k–£80k'),
  payrollStartDate: { key: 'payrollStartDate', label: 'Payroll start date', type: 'date', group: 'banking' },
  nationalInsuranceNumberStatus: status('nationalInsuranceNumberStatus', 'National Insurance number status', 'banking'),
  taxCodeKnown: status('taxCodeKnown', 'Tax code known?', 'banking'),
  assetsPropertyPension: area('assetsPropertyPension', 'Assets, property & pension', 'banking'),
  isaSippPensionDetails: area('isaSippPensionDetails', 'ISA, SIPP & pension details', 'banking'),
  isaDetails: area('isaDetails', 'ISA details', 'banking'),
  sippWorkplacePensionDetails: area('sippWorkplacePensionDetails', 'SIPP & workplace pension details', 'banking'),
  statePensionNiRecordStatus: status('statePensionNiRecordStatus', 'State pension / NI record status', 'banking'),
  investmentAccountsBrokerRestrictions: area('investmentAccountsBrokerRestrictions', 'Investment accounts & broker restrictions', 'banking'),
  companyEquityOrCrypto: area('companyEquityOrCrypto', 'Company equity or crypto', 'banking'),
  schoolOrNurseryNeeds: area('schoolOrNurseryNeeds', 'School or nursery needs', 'family'),
  spouseWorkPlans: area('spouseWorkPlans', 'Spouse work plans', 'family'),
  partnerWorkPlans: area('partnerWorkPlans', 'Partner work plans', 'family'),
  childrenCurrentSchoolYears: text('childrenCurrentSchoolYears', 'Children current school years', 'family', 'e.g. Year 2, Year 5'),
  schoolPreferences: area('schoolPreferences', 'School preferences', 'family'),
  localAuthorityAreaIfKnown: text('localAuthorityAreaIfKnown', 'Local authority area (if known)', 'family'),
  nurseryChildcareNeeds: area('nurseryChildcareNeeds', 'Nursery / childcare needs', 'family'),
  specialEducationNeeds: area('specialEducationNeeds', 'Special education needs', 'family'),
  custodyConsentDocuments: status('custodyConsentDocuments', 'Custody / consent documents', 'family'),
  birthMarriageCertificates: status('birthMarriageCertificates', 'Birth & marriage certificates', 'family'),
  under18GuardianNeeds: area('under18GuardianNeeds', 'Under-18 guardian needs', 'family'),
  familyVisitorsPlan: area('familyVisitorsPlan', 'Family visitors plan', 'family'),
  emergencyContacts: area('emergencyContacts', 'Emergency contacts', 'family'),
  healthInsuranceStatusUae: status('healthInsuranceStatusUae', 'UAE health insurance status', 'health'),
  healthConditionsPrescriptions: area('healthConditionsPrescriptions', 'Health conditions & prescriptions', 'health'),
  privateMedicalInsuranceStatus: status('privateMedicalInsuranceStatus', 'Private medical insurance status', 'health'),
  gpRegistrationPlan: area('gpRegistrationPlan', 'GP registration plan', 'health'),
  disabilityOrWellbeingSupportNeeds: area('disabilityOrWellbeingSupportNeeds', 'Disability or wellbeing support needs', 'health'),
  vaccinationRecords: status('vaccinationRecords', 'Vaccination records', 'health'),
  dentalOpticalNeeds: area('dentalOpticalNeeds', 'Dental / optical needs', 'health'),
  petsDetails: area('petsDetails', 'Pets details', 'pets', 'Species, breed, number'),
  petVaccinationMicrochipStatus: status('petVaccinationMicrochipStatus', 'Pet vaccination / microchip status', 'pets'),
  documentsNeedingAttestation: area('documentsNeedingAttestation', 'Documents needing attestation', 'documents'),
  degreeProfessionalQualifications: area('degreeProfessionalQualifications', 'Degree & professional qualifications', 'documents'),
  marriageBirthSchoolRecords: area('marriageBirthSchoolRecords', 'Marriage, birth & school records', 'documents'),
  documentsTranslationsApostille: area('documentsTranslationsApostille', 'Documents, translations & apostille', 'documents'),
  documentsTranslations: area('documentsTranslations', 'Documents & translations', 'documents'),
  degreeDocuments: status('degreeDocuments', 'Degree documents', 'documents'),
  degreeDiplomaTranscripts: status('degreeDiplomaTranscripts', 'Degree / diploma transcripts', 'documents'),
  professionalQualifications: area('professionalQualifications', 'Professional qualifications', 'documents'),
  regulatedProfession: text('regulatedProfession', 'Regulated profession?', 'documents', 'e.g. doctor, lawyer'),
  documentsNeedingApostilleTranslationAttestation: area('documentsNeedingApostilleTranslationAttestation', 'Documents needing apostille / translation / attestation', 'documents'),
  drivingLicenceCountry: text('drivingLicenceCountry', 'Driving licence country', 'logistics'),
  needsUaeDrivingLicence: { key: 'needsUaeDrivingLicence', label: 'Need UAE driving licence?', type: 'select', options: yesNo, group: 'logistics' },
  needsCarInUk: { key: 'needsCarInUk', label: 'Need a car in UK?', type: 'select', options: yesNo, group: 'logistics' },
  shippingStorageNeeds: area('shippingStorageNeeds', 'Shipping & storage needs', 'logistics'),
  ukPhoneNumberPlan: area('ukPhoneNumberPlan', 'UK phone number plan', 'logistics'),
  ukPhoneSimPlan: area('ukPhoneSimPlan', 'UK phone / SIM plan', 'logistics'),
  ukPhoneNumber2faPlan: area('ukPhoneNumber2faPlan', 'UK phone / 2FA continuity plan', 'logistics'),
  mailForwardingPlan: area('mailForwardingPlan', 'Mail forwarding plan', 'logistics'),
  arrivalDateTime: text('arrivalDateTime', 'Arrival date & time', 'logistics', 'e.g. 12 Sep, 14:30'),
  airportArrivalPlan: area('airportArrivalPlan', 'Airport arrival plan', 'logistics'),
  campusCity: text('campusCity', 'Campus city', 'logistics'),
  courseName: text('courseName', 'Course name', 'logistics'),
  scholarshipIncome: area('scholarshipIncome', 'Scholarship income', 'logistics'),
  partTimeWorkIntent: area('partTimeWorkIntent', 'Part-time work intent', 'logistics'),
  safetyScamConcerns: area('safetyScamConcerns', 'Safety & scam concerns', 'logistics'),
  noClaimsInsuranceRecords: status('noClaimsInsuranceRecords', 'No-claims insurance records', 'logistics'),
  existingWillsEstatePlans: area('existingWillsEstatePlans', 'Existing wills & estate plans', 'estate'),
  estateWillsGuardianshipStatus: status('estateWillsGuardianshipStatus', 'Estate, wills & guardianship status', 'estate'),
  expertAdvisersAlreadyEngaged: area('expertAdvisersAlreadyEngaged', 'Expert advisers already engaged', 'estate'),
  returnToUkIntentions: area('returnToUkIntentions', 'Return-to-UK intentions', 'estate'),
  destinationVisaRoute: text('destinationVisaRoute', 'Destination visa route', 'destination'),
  destinationResidenceStatus: status('destinationResidenceStatus', 'Destination residence status', 'destination'),
  destinationBankingStatus: status('destinationBankingStatus', 'Destination banking status', 'destination'),
  destinationHealthcareStatus: status('destinationHealthcareStatus', 'Destination healthcare status', 'destination'),
  destinationHousingStatus: status('destinationHousingStatus', 'Destination housing status', 'destination'),
};

const INPUTS_EXCLUDED_KEYS = new Set(['email', 'name', 'originCountry', 'destinationCountry']);

function labelFromKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/Uae/g, 'UAE')
    .replace(/Uk/g, 'UK')
    .replace(/Nhs/g, 'NHS')
    .replace(/Gp/g, 'GP')
    .replace(/Ihs/g, 'IHS')
    .replace(/Cas/g, 'CAS')
    .replace(/Sa109/g, 'SA109')
    .replace(/P85/g, 'P85')
    .replace(/Isa/g, 'ISA')
    .replace(/Sipp/g, 'SIPP')
    .replace(/Ni/g, 'NI')
    .replace(/Fx/g, 'FX')
    .replace(/2fa/g, '2FA')
    .trim();
}

export function checkFieldDef(key: string): FieldDef {
  const def: FieldDef =
    CHECK_FIELD_DEFS[key] ?? {
      key,
      label: labelFromKey(key),
      type: 'text',
      section: 'flags',
    };
  if (
    !def.required &&
    def.type !== 'email' &&
    def.type !== 'select' &&
    def.allowDontKnow === undefined
  ) {
    return { ...def, allowDontKnow: true };
  }
  return def;
}

export function checkFieldsForRoute(keys: string[]): FieldDef[] {
  return keys.map(checkFieldDef);
}

export const CHECK_INTAKE_STEP_DEFS = [
  {
    key: 'contact',
    title: 'About you',
    subtitle: 'So we can send your check and personalise your report.',
  },
  {
    key: 'move',
    title: 'Your move',
    subtitle: "Where you're going, when, and who's moving with you.",
  },
  {
    key: 'status',
    title: "Where you're at",
    subtitle: 'Your current progress and what worries you most.',
  },
] as const;

const CHECK_SECTION_TO_STEP: Record<string, (typeof CHECK_INTAKE_STEP_DEFS)[number]['key']> = {
  contact: 'contact',
  move: 'move',
  status: 'status',
  flags: 'status',
  concerns: 'status',
};

export function groupCheckFieldsIntoSteps(
  fields: FieldDef[],
): Array<{ step: (typeof CHECK_INTAKE_STEP_DEFS)[number]; fields: FieldDef[] }> {
  const buckets = CHECK_INTAKE_STEP_DEFS.map((step) => ({ step, fields: [] as FieldDef[] }));
  const indexByKey = Object.fromEntries(CHECK_INTAKE_STEP_DEFS.map((s, i) => [s.key, i]));

  for (const field of fields) {
    const stepKey = CHECK_SECTION_TO_STEP[field.section ?? 'flags'] ?? 'status';
    buckets[indexByKey[stepKey]].fields.push(field);
  }

  return buckets.filter((b) => b.fields.length > 0);
}

const CHECK_SECTION_TO_LIVING_GROUP: Record<string, LivingFieldGroup> = {
  contact: 'other',
  move: 'logistics',
  status: 'visa',
  flags: 'family',
  concerns: 'other',
};

export function livingFieldDef(key: string): FieldDef {
  if (LIVING_FIELD_DEFS[key]) return LIVING_FIELD_DEFS[key];
  const check = CHECK_FIELD_DEFS[key];
  if (check) {
    return {
      ...check,
      section: undefined,
      group: check.section ? (CHECK_SECTION_TO_LIVING_GROUP[check.section] ?? 'other') : 'other',
    };
  }
  const isStatus = key.toLowerCase().includes('status');
  return {
    key,
    label: labelFromKey(key),
    type: isStatus ? 'select' : 'textarea',
    options: isStatus ? statusOptions : undefined,
    group: 'other',
    allowDontKnow: !isStatus,
  };
}

export function formatIntakeAnswer(value?: string): string {
  if (!value) return '';
  if (value === DONT_KNOW_VALUE) return "Don't know yet";
  return value;
}

export function livingIntakeFields(keys: string[]): FieldDef[] {
  return keys.map(livingFieldDef);
}

export function groupLivingFields(fields: FieldDef[]): Array<{ group: LivingFieldGroup; label: string; fields: FieldDef[] }> {
  const buckets = new Map<LivingFieldGroup, FieldDef[]>();
  for (const field of fields) {
    const group = field.group ?? 'other';
    if (!buckets.has(group)) buckets.set(group, []);
    buckets.get(group)!.push(field);
  }
  return LIVING_GROUP_ORDER.filter((g) => buckets.has(g)).map((group) => ({
    group,
    label: LIVING_GROUP_LABELS[group],
    fields: buckets.get(group)!,
  }));
}

/** @deprecated Use inputsFieldsForRoute */
export function livingFieldsForRoute(keys: string[]): FieldDef[] {
  return inputsFieldsForRoute([], keys);
}

export function inputsFieldsForRoute(checkFieldKeys: string[], livingFieldKeys: string[]): FieldDef[] {
  const editableCheck = checkFieldKeys.filter((k) => !INPUTS_EXCLUDED_KEYS.has(k));
  const merged = [...new Set([...editableCheck, ...livingFieldKeys])];
  return merged.map(livingFieldDef);
}

export function inputsFieldsGrouped(
  checkFieldKeys: string[],
  livingFieldKeys: string[],
): Array<{ group: LivingFieldGroup; label: string; fields: FieldDef[] }> {
  return groupLivingFields(inputsFieldsForRoute(checkFieldKeys, livingFieldKeys));
}
