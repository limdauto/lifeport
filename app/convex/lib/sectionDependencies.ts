/** Which living-report sections are affected when a profile field changes. */
export const FIELD_AFFECTED_SECTIONS: Record<string, string[]> = {
  moveDate: ['timeline', 'tax_residence', 'uk_departure_admin', 'first_90_days', 'risk_map', 'hidden_dependencies'],
  householdType: ['family_school_dependants', 'family', 'housing_ejari_utilities', 'housing_right_to_rent_utilities', 'healthcare_insurance', 'estate_wills_guardianship', 'move_profile'],
  visaStatus: ['visa_admin_evisa_share_codes', 'uae_residency_emirates_id', 'student_visa_cas_evisa', 'timeline', 'risk_map', 'banking_money', 'hidden_dependencies'],
  primaryApplicantVisaStatus: ['visa_admin_evisa_share_codes', 'family_school_nursery_dependants', 'timeline', 'hidden_dependencies'],
  housingStatus: ['housing_ejari_utilities', 'housing_right_to_rent_utilities', 'accommodation_housing', 'timeline', 'first_90_days', 'banking_money'],
  accommodationStatus: ['accommodation_housing', 'banking_money_parent_funding', 'timeline'],
  bankingStatus: ['banking_money', 'banking_money_parent_funding', 'first_90_days', 'housing_ejari_utilities', 'hidden_dependencies'],
  topConcerns: ['risk_map', 'executive_brief'],
  biggestWorry: ['risk_map', 'executive_brief'],
  hasChildren: ['family_school_dependants', 'family_school_nursery_dependants', 'family_parent_communication'],
  childrenAges: ['family_school_dependants', 'family_school_nursery_dependants', 'housing_right_to_rent_utilities'],
  hasPets: ['pets_animal_travel'],
  ownsUkProperty: ['property_pension_investments', 'tax_residence', 'uk_departure_admin'],
  hasUkProperty: ['property_pension_investments', 'tax_residence', 'hmrc_self_assessment_p85'],
  hasUkPensionIsaInvestments: ['property_pension_investments', 'tax_residence'],
  expectedUkDaysAfterMove: ['tax_residence', 'timeline', 'uk_departure_admin'],
  casStatus: ['student_visa_cas_evisa', 'timeline'],
  evisaStatus: ['visa_admin_evisa_share_codes', 'student_visa_cas_evisa', 'banking_money'],
  ukviAccountStatus: ['visa_admin_evisa_share_codes', 'student_visa_cas_evisa'],
  emiratesIdStatus: ['uae_residency_emirates_id', 'banking_money', 'housing_ejari_utilities'],
  ejariStatus: ['housing_ejari_utilities', 'banking_money'],
  assetsPropertyPension: ['property_pension_investments', 'tax_residence', 'estate_wills_guardianship'],
  dependants: ['family_school_dependants', 'family_school_nursery_dependants', 'visa_admin_evisa_share_codes'],
  schoolNeeds: ['family_school_nursery_dependants', 'housing_right_to_rent_utilities'],
  schoolPreferences: ['family_school_nursery_dependants', 'housing_right_to_rent_utilities'],
  university: ['student_visa_cas_evisa', 'university_registration', 'banking_money_parent_funding'],
  courseStartDate: ['timeline', 'first_week_first_term'],
  destinationVisaStatus: ['destination_setup', 'timeline'],
  currentUkTaxResidenceStatus: ['tax_residence', 'uk_departure_admin', 'risk_map'],
  taxResidenceLastFiveYears: ['tax_residence', 'uk_departure_admin'],
  ukTiesHomeWorkFamily: ['tax_residence', 'risk_map'],
  ukEmploymentOrBusinessAfterMove: ['tax_residence', 'work_payroll_ni_tax_code', 'uk_departure_admin'],
  uaeVisaRoute: ['uae_residency_emirates_id', 'hidden_dependencies', 'timeline'],
  employerSponsorStatus: ['uae_residency_emirates_id', 'visa_admin_evisa_share_codes'],
  healthInsuranceStatusUae: ['healthcare_insurance', 'uae_residency_emirates_id'],
  uaeHousingPlan: ['housing_ejari_utilities', 'timeline', 'first_90_days'],
  dewaUtilitiesStatus: ['housing_ejari_utilities'],
  bankingNeedsSalaryRentFamilyTransfers: ['banking_money', 'hidden_dependencies'],
  currentBankAccounts: ['banking_money', 'tax_residence'],
  sourceOfFundsComplexity: ['banking_money', 'risk_map'],
  ukPropertyRentalOrSalePlans: ['property_pension_investments', 'tax_residence', 'uk_departure_admin'],
  isaSippPensionDetails: ['property_pension_investments', 'tax_residence'],
  spouseWorkPlans: ['family_school_dependants', 'uae_residency_emirates_id'],
  schoolOrNurseryNeeds: ['family_school_dependants', 'housing_ejari_utilities'],
  petsDetails: ['pets_animal_travel'],
  petVaccinationMicrochipStatus: ['pets_animal_travel'],
  documentsNeedingAttestation: ['documents_credentials_attestation', 'credentials_licences_attestation'],
  degreeProfessionalQualifications: ['credentials_licences_attestation', 'documents_credentials'],
  marriageBirthSchoolRecords: ['documents_family_records', 'family_school_dependants'],
  shippingStorageNeeds: ['shipping_storage_possessions', 'timeline'],
  temporaryAccommodationNeeds: ['housing_ejari_utilities', 'housing_right_to_rent_utilities', 'accommodation_housing'],
  healthConditionsPrescriptions: ['healthcare_insurance', 'healthcare_gp_nhs_insurance', 'healthcare_gp_wellbeing'],
  existingWillsEstatePlans: ['estate_wills_guardianship'],
  visaRoute: ['visa_admin_evisa_share_codes', 'hidden_dependencies'],
  certificateOfSponsorshipStatus: ['visa_admin_evisa_share_codes', 'work_payroll_ni_tax_code'],
  rightToWorkReadiness: ['visa_admin_evisa_share_codes', 'work_payroll_ni_tax_code'],
  rightToRentReadiness: ['housing_right_to_rent_utilities'],
  salaryBand: ['work_payroll_ni_tax_code', 'banking_money'],
  payrollStartDate: ['work_payroll_ni_tax_code', 'timeline'],
  studentVisaApplicationStatus: ['student_visa_cas_evisa', 'timeline'],
  visaDecisionStatus: ['student_visa_cas_evisa', 'timeline'],
  ihsPaymentStatus: ['student_visa_cas_evisa', 'healthcare_gp_wellbeing'],
  studentBankLetterAvailability: ['banking_money_parent_funding', 'hidden_dependencies'],
  parentFundingPlan: ['banking_money_parent_funding', 'family_parent_communication'],
  primaryApplicantVisaRoute: ['visa_admin_evisa_share_codes', 'family_school_nursery_dependants'],
  partnerWorkPlans: ['family_school_nursery_dependants', 'visa_admin_evisa_share_codes'],
  nurseryChildcareNeeds: ['family_school_nursery_dependants'],
  familyBankingNeeds: ['banking_money', 'family_school_nursery_dependants'],
  expectedUkDaysCurrentTaxYear: ['tax_residence', 'hmrc_self_assessment_p85'],
  expectedUkDaysNextTaxYear: ['tax_residence', 'hmrc_self_assessment_p85'],
  p85Status: ['hmrc_self_assessment_p85', 'uk_departure_admin'],
  sa109Status: ['hmrc_self_assessment_p85', 'tax_residence'],
  ukPropertyDetails: ['property_pension_investments', 'hmrc_self_assessment_p85'],
  ukPropertySaleOrRentalPlans: ['property_pension_investments', 'tax_residence'],
  destinationVisaRoute: ['destination_setup', 'timeline'],
  destinationResidenceStatus: ['destination_setup', 'tax_residence'],
  destinationBankingStatus: ['destination_setup', 'banking_money'],
  destinationHealthcareStatus: ['destination_setup', 'healthcare_insurance'],
  destinationHousingStatus: ['destination_setup', 'housing_ejari_utilities'],
};

export function affectedSectionsForChanges(
  changes: Record<string, unknown>,
  availableSections: string[],
): string[] {
  const affected = new Set<string>();
  for (const field of Object.keys(changes)) {
    for (const section of FIELD_AFFECTED_SECTIONS[field] ?? []) {
      if (availableSections.includes(section)) {
        affected.add(section);
      }
    }
  }
  return [...affected].filter((s) => s !== 'change_log' && s !== 'recommended_packages');
}

export function changeSummaryForSections(sectionKeys: string[]): string {
  if (sectionKeys.length === 0) return 'No sections affected.';
  const labels = sectionKeys.map((k) => k.replace(/_/g, ' '));
  if (labels.length === 1) return `${labels[0]} updated.`;
  return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]} updated.`;
}
