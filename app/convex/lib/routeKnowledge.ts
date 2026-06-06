import type { CheckAnswers } from './checkGenerator';
import { PACKAGE_CATALOG } from './packageCatalog';
import type { PackageKey, RouteConfig, RouteKey } from './routeConfigs';
import { sectionTitle } from './sectionTitles';

type LivingAnswers = CheckAnswers & Record<string, string | undefined>;

export type SectionContext = {
  route: RouteConfig;
  answers: LivingAnswers;
  baseRisk: 'low' | 'medium' | 'high';
};

export type SectionDraft = {
  contentMarkdown: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
};

type RouteSectionKnowledge = Partial<Record<string, (ctx: SectionContext) => SectionDraft>>;

function moveLine(answers: LivingAnswers): string {
  return `**${answers.name}** · ${answers.originCountry} → ${answers.destinationCountry}${
    answers.destinationCity ? ` (${answers.destinationCity})` : ''
  }${answers.moveDate ? ` · target **${answers.moveDate}**` : ''} · **${answers.householdType}**`;
}

const DAY_ONE_PACK_NOTE =
  '\n\n*Want this handled for you? Request the **Day 1 Arrival Pack** from Packages — eSIM provisioning, airport-to-door routing, and a personalised first-night checklist.*';

function hiddenDepsUkArrival(): string {
  return `**UK arrival dependency chain (current):**

1. **Visa decision → UKVI account → eVisa** — immigration status is digital-first; expired BRPs from 31 Dec 2024 point to UKVI accounts/eVisas
2. **eVisa + share code → right to work / right to rent** — employers and landlords verify via share codes, not physical BRP collection
3. **Proof of address ↔ bank account ↔ tenancy** — circular dependency; employer letter or interim address often needed
4. **NI number + payroll + tax code** — salary setup depends on immigration proof and HMRC registration timing
5. **GP registration** — needs address; prescriptions and family records should be planned before travel

*Police registration ended August 2022 — not part of your critical path.*`;
}

const UK_TO_DUBAI: RouteSectionKnowledge = {
  hidden_dependencies: () => ({
    riskLevel: 'high',
    contentMarkdown: `**UAE setup dependency chain:**

1. **Residence visa / entry permit → medical fitness test** — adult residence applicants typically need medical fitness clearance
2. **Medical fitness → Emirates ID biometrics** — ID underpins most local admin
3. **Emirates ID + health insurance → residence permit issuance** — valid health insurance is linked to residence processes
4. **Emirates ID + salary certificate → UAE bank account** — source-of-funds and KYC checks are common
5. **Bank account + Ejari → DEWA/utilities** — Dubai Land Department Ejari registers tenancy; utilities follow address proof
6. **Ejari/address → school letters, family sponsorship, driving licence exchange**

**UK departure chain (parallel):**
- Move date + UK day counts → Statutory Residence Test / split-year position
- P85 / SA109 / Self Assessment → may need filing before or after departure
- UK property, ISA contribution limits, pension rules → can continue to create UK admin after you leave`,
  }),

  executive_brief: ({ route, answers, baseRisk }) => ({
    riskLevel: baseRisk,
    contentMarkdown: `${moveLine(answers)}

**Primary concern:** ${answers.biggestWorry}

${answers.hasUkPensionIsaInvestments === 'yes' ? '⚠️ UK pension/ISA/investment exposure flagged — tax and broker rules need sequencing with departure.\n\n' : ''}${answers.ownsUkProperty === 'yes' ? '⚠️ UK property flagged — rental, CGT and non-resident landlord admin may continue after departure.\n\n' : ''}**${route.title} critical path:** UK tax exit timing → UAE residence (visa → medical → Emirates ID) → banking → Ejari/housing → family & school setup.`,
  }),

  timeline: ({ answers }) => ({
    riskLevel: answers.moveDate ? 'medium' : 'high',
    contentMarkdown: answers.moveDate
      ? `**Target move:** ${answers.moveDate}

| Phase | Focus |
|-------|-------|
| **T-90** | SRT/split-year review, UAE visa route, document attestation (MOFA/UAE), UK property/pension decisions |
| **T-60** | Medical fitness booking, bank pre-qualification, school enquiries, pet import permits (MOCCAE) |
| **T-30** | Notice periods, shipping, interim Dubai accommodation |
| **T+14** | Medical completion, Emirates ID, bank activation |
| **T+30** | Ejari, DEWA, health insurance confirmation, driving licence exchange |
| **T+90** | UK tax evidence filed, family settled, UK mail/admin cutover complete |`
      : `Add a move date in Inputs to sequence UK departure admin against UAE residence, medical fitness and Emirates ID.`,
  }),

  uk_departure_admin: ({ answers }) => ({
    riskLevel: 'high',
    contentMarkdown: `**Before you leave the UK:**

- Review Statutory Residence Test position and whether split-year treatment may apply
- Plan P85 / SA109 / Self Assessment if required for departure year
- Council tax, GP/dental closure, mail redirection, electoral roll
- Collect documents needing apostille or UAE MOFA attestation **before** departure where possible
${answers.expectedUkDaysAfterMove ? `\n**Expected UK days after move:** ${answers.expectedUkDaysAfterMove} — affects residence tests.` : ''}`,
  }),

  tax_residence: ({ answers }) => ({
    riskLevel: 'high',
    contentMarkdown: `**UK exit · UAE entry**

UK: SRT day counts, split-year conditions, CGT on UK property, ISA contribution limits for non-residents, pension and investment reporting.

UAE: Personal income tax not levied, but residence evidence matters for banking and treaties.

${answers.hasUkPensionIsaInvestments === 'yes' ? '**You flagged UK pension/ISA/investments** — review broker restrictions and departure-year treatment.' : ''}`,
  }),

  uae_residency_emirates_id: ({ answers }) => ({
    riskLevel: answers.visaStatus === 'not_started' ? 'high' : 'medium',
    contentMarkdown: `**Visa status:** ${answers.visaStatus}

**Sequence:** entry/residence process → **medical fitness test** → **Emirates ID biometrics** → residence permit (with **valid health insurance**).

${answers.visaStatus === 'not_started' ? '⚠️ Residence route not confirmed — blocks Emirates ID, banking, Ejari and family visas.' : 'Track medical appointment and ID collection dates against your move date.'}`,
  }),

  banking_money: ({ answers }) => ({
    riskLevel: answers.bankingStatus === 'not_started' ? 'high' : 'medium',
    contentMarkdown: `**Status:** ${answers.bankingStatus}

UAE banks typically require residence visa, Emirates ID, salary certificate and proof of address. Plan fallback card access and international transfers until local payroll is live.

Keep UK accounts until UAE routing is confirmed.`,
  }),

  housing_ejari_utilities: ({ answers }) => ({
    riskLevel: answers.housingStatus === 'not_started' ? 'high' : 'medium',
    contentMarkdown: `**Housing status:** ${answers.housingStatus}

**Ejari** (Dubai Land Department) registers tenancy contracts — often needed as address proof for banking and schools. **DEWA** utilities follow Ejari.

Interim hotel/apartment common while Emirates ID and bank account are pending.`,
  }),

  pets_animal_travel: ({ answers }) => ({
    riskLevel: answers.hasPets === 'yes' ? 'medium' : 'low',
    contentMarkdown:
      answers.hasPets === 'yes'
        ? `**Pets flagged** — UAE import typically requires MOCCAE import permits, vaccination and microchip timing aligned with travel. Pet-friendly housing and summer travel restrictions need early planning.`
        : `No pets flagged at intake. Update Inputs if an animal is joining later.`,
  }),

  credentials_licences_attestation: () => ({
    riskLevel: 'medium',
    contentMarkdown: `**Document chain:** degree certificates, marriage/birth records, school transcripts → UK apostille where needed → **UAE MOFA attestation** for official documents used in visa, banking and school admission.`,
  }),

  day_one_arrival: ({ answers }) => ({
    riskLevel: answers.moveDate ? 'medium' : 'high',
    contentMarkdown: `**Dubai landing — first 24 hours**

| Priority | What to sort |
|----------|--------------|
| **eSIM / mobile** | Activate UAE eSIM (Du/Etisalat) before baggage reclaim — needed for Careem, Uber, employer WhatsApp, and banking OTPs |
| **DXB → accommodation** | Careem/Uber/RTA taxi to hotel or interim flat; have hotel or short-stay address ready (Ejari not required for hotels) |
| **Money** | International cards work at DXB; withdraw small AED for tips; know when salary card arrives |
| **Documents on person** | Passport, entry permit/residence proof, health insurance, hotel booking, employment letter |
| **First night** | Confirm interim check-in, save landlord/employer contacts, test mobile data before leaving the airport zone |

${answers.temporaryAccommodationNeeds ? `**Interim stay:** ${answers.temporaryAccommodationNeeds}\n\n` : ''}${answers.moveDate ? `**Arrival anchor:** ${answers.moveDate}` : '**Add your move date** in Inputs to time eSIM activation and airport pickup.'}${DAY_ONE_PACK_NOTE}`,
  }),
};

const PROFESSIONALS_TO_UK: RouteSectionKnowledge = {
  hidden_dependencies: () => ({
    riskLevel: 'high',
    contentMarkdown: hiddenDepsUkArrival(),
  }),

  visa_admin_evisa_share_codes: ({ answers }) => ({
    riskLevel: answers.visaStatus === 'not_started' ? 'high' : 'medium',
    contentMarkdown: `**Visa status:** ${answers.visaStatus}

**Current UK friction:** create **UKVI account** → access **eVisa** → generate **share codes** for right to work and right to rent.

Do not plan around BRP collection or police registration — eVisa/share-code readiness is the operational path.`,
  }),

  work_payroll_ni_tax_code: ({ answers }) => ({
    riskLevel: 'medium',
    contentMarkdown: `**Employer support:** ${answers.employerSupportLevel ?? 'not specified'}

Confirm: Certificate of Sponsorship, payroll start date, **National Insurance number** application, and first **tax code** before salary lands.`,
  }),

  banking_money: ({ answers }) => ({
    riskLevel: answers.bankingStatus === 'not_started' ? 'high' : 'medium',
    contentMarkdown: `**Banking status:** ${answers.bankingStatus}

Typical UK student/professional path: passport + immigration status proof + **proof of address** + employer letter. Phone number and interim address often required.`,
  }),

  housing_right_to_rent_utilities: ({ answers }) => ({
    riskLevel: answers.housingStatus === 'not_started' ? 'high' : 'medium',
    contentMarkdown: `**Housing status:** ${answers.housingStatus}

Landlords verify **right to rent** via share code. Deposit, guarantor and utility setup depend on tenancy start aligned with eVisa validity.`,
  }),

  day_one_arrival: ({ answers }) => ({
    riskLevel: answers.moveDate ? 'medium' : 'high',
    contentMarkdown: `**UK arrival day — first 24 hours**

| Priority | What to sort |
|----------|--------------|
| **eSIM / UK SIM** | Activate before ride-hailing and banking OTPs — airport vending machines or high-street prepay (EE, Vodafone, giffgaff) |
| **Airport → home** | Heathrow/Gatwick Express, Elizabeth line, Tube, or pre-booked taxi; **contactless/Oyster** for London |
| **Proof on person** | Passport, eVisa/UKVI access, tenancy or hotel confirmation, employer welcome pack |
| **Money** | Contactless widely accepted; small GBP cash for markets; confirm first salary date |
| **First evening** | Collect keys or hotel check-in, test mobile data, save HR/landlord contacts, plan NI number application |

${answers.temporaryAccommodationNeeds ? `**Interim stay:** ${answers.temporaryAccommodationNeeds}\n\n` : ''}${answers.moveDate ? `**Arrival anchor:** ${answers.moveDate}` : '**Add your move date** in Inputs to book airport transfer and SIM delivery.'}${DAY_ONE_PACK_NOTE}`,
  }),
};

const STUDENTS_TO_UK: RouteSectionKnowledge = {
  hidden_dependencies: () => ({
    riskLevel: 'high',
    contentMarkdown: `${hiddenDepsUkArrival()}

**Student-specific chain:**
- **CAS → Student visa + IHS → eVisa** before travel
- **University bank letter** (Letter of Introduction for UK Banking Facilities) → student bank account
- **Accommodation contract** → proof of address → bank letter → GP registration
- **Dependant eligibility** is restricted on most Student routes — verify early if partner/child plans exist`,
  }),

  student_visa_cas_evisa: ({ answers }) => ({
    riskLevel: answers.casStatus === 'not_started' || answers.visaStatus === 'not_started' ? 'high' : 'medium',
    contentMarkdown: `**CAS:** ${answers.casStatus ?? 'not specified'} · **Visa:** ${answers.visaStatus}

After CAS: apply for Student visa, pay **IHS**, receive decision, then set up **UKVI account** and **eVisa** before travel. BRP collection is no longer the primary workflow.`,
  }),

  banking_money_parent_funding: ({ answers }) => ({
    riskLevel: answers.bankingStatus === 'not_started' ? 'high' : 'medium',
    contentMarkdown: `**Banking:** ${answers.bankingStatus}

UCAS lists typical documents: passport, student visa/eVisa proof, proof of address, and university **bank introduction letter**.

${answers.parentInvolved === 'yes' ? '**Parent funding flagged** — plan tuition/rent FX safety, emergency card access and scam-aware transfers.' : ''}`,
  }),

  student_safety_scams: () => ({
    contentMarkdown: `**Arrival safety priorities:** verify accommodation before sending deposits, use official university payment channels, keep parent emergency contacts updated, and treat unsolicited visa/bank messages as high-risk.`,
  }),

  day_one_arrival: ({ answers }) => ({
    riskLevel: answers.moveDate || answers.arrivalDateTime ? 'medium' : 'high',
    contentMarkdown: `**Student arrival day — first 24 hours**

| Priority | What to sort |
|----------|--------------|
| **eSIM / UK SIM** | Activate before Uber, university apps, and bank OTPs — many students use airport eSIM or prepay SIM posted to UK address |
| **Airport → halls / flat** | Check university pickup times; otherwise National Rail + local bus/taxi; save **16–25 Railcard** task for week one |
| **Contactless travel** | Oyster/contactless caps apply in London; coach links (National Express, Megabus) common for regional campuses |
| **Check-in window** | Halls often have fixed arrival slots — late flights need interim hotel; keep tenancy/halls confirmation on phone |
| **Parent comms** | Send safe-arrival message on data (not airport Wi‑Fi only); agree emergency contact tree before travel |
| **First purchases** | Bedding/pantry if self-catered; small GBP cash; groceries before shops close |

${answers.airportArrivalPlan ? `**Your plan:** ${answers.airportArrivalPlan}\n\n` : ''}${answers.ukPhoneSimPlan ? `**SIM plan:** ${answers.ukPhoneSimPlan}\n\n` : ''}${answers.arrivalDateTime ? `**Landing:** ${answers.arrivalDateTime}` : answers.moveDate ? `**Arrival anchor:** ${answers.moveDate}` : '**Add arrival date/time** in Inputs to sequence SIM and transport.'}${DAY_ONE_PACK_NOTE}`,
  }),
};

const FAMILIES_TO_UK: RouteSectionKnowledge = {
  hidden_dependencies: () => ({
    riskLevel: 'high',
    contentMarkdown: `${hiddenDepsUkArrival()}

**Family-specific chain:**
- **Main applicant visa → dependant visas** (timing tied to sponsor route)
- **Housing area → school catchment / nursery waitlists**
- **Right to rent share codes** for entire household
- **Marriage/birth certificates + translations** before school admission`,
  }),

  family_school_nursery_dependants: ({ answers }) => ({
    riskLevel: answers.hasChildren === 'yes' ? 'medium' : 'low',
    contentMarkdown:
      answers.hasChildren === 'yes' || answers.childrenAges
        ? `**Children:** ${answers.childrenAges ?? 'yes'}\n\n**School needs:** ${answers.schoolNeeds ?? 'add in Inputs'}\n\nMap year-group placement, local authority admission process and nursery waitlists against housing search — catchment often drives lease location.`
        : `Add children ages and school needs in Inputs if dependants are joining.`,
  }),

  visa_admin_evisa_share_codes: ({ answers }) => ({
    riskLevel: 'high',
    contentMarkdown: `**Main applicant visa:** ${answers.primaryApplicantVisaStatus ?? answers.visaStatus}

Each dependant needs their own immigration status. eVisa + share codes apply to right to work/rent checks for adults in the household.`,
  }),

  day_one_arrival: ({ answers }) => ({
    riskLevel: answers.moveDate ? 'medium' : 'high',
    contentMarkdown: `**Family arrival day — first 24 hours**

| Priority | What to sort |
|----------|--------------|
| **SIMs for adults** | UK eSIM/prepay for ride-hailing, GP booking, school calls — plan a child-safe comms approach |
| **Airport → home** | Pre-book larger taxi or estate car if luggage + pushchair; contactless rail where prams are allowed |
| **Check-in & keys** | Align tenancy start with eVisa validity; interim hotel if completion slips — children need sleep stability |
| **Food & pharmacy** | Locate 24h supermarket and pharmacy near interim address; pack favourite snacks for jet-lagged children |
| **Emergency docs** | Marriage/birth certificates on person for school enquiries; GP registration cannot wait if prescriptions needed |

${answers.hasChildren === 'yes' ? '**Children moving** — prioritise sleep, snacks, and school/nursery contact numbers on day one.\n\n' : ''}${answers.moveDate ? `**Arrival anchor:** ${answers.moveDate}` : '**Add your move date** in Inputs to book family airport transfer.'}${DAY_ONE_PACK_NOTE}`,
  }),
};

const LEAVING_UK: RouteSectionKnowledge = {
  hidden_dependencies: () => ({
    riskLevel: 'high',
    contentMarkdown: `**Leaving UK dependency map:**

1. **SRT day counts + UK ties** → determines residence status (leaving ≠ non-resident automatically)
2. **Split-year conditions** → may affect which income is taxed where in departure year
3. **P85 / SA109 / Self Assessment** → parallel to destination setup
4. **UK property** → sale, rent, NRLS, CGT reporting even if no tax due
5. **ISA / pension / broker** → contribution and access rules change for non-residents
6. **UK bank + 2FA + phone** → overseas address can break access
7. **Destination visa → banking → housing** → runs in parallel, not after UK admin finishes`,
  }),

  tax_residence: ({ answers }) => ({
    riskLevel: 'high',
    contentMarkdown: `**Statutory Residence Test** uses day counts and ties tests — plan expected UK days carefully.

${answers.expectedUkDaysAfterMove ? `**Expected UK days after move:** ${answers.expectedUkDaysAfterMove}` : 'Add expected UK days in Inputs.'}

Split-year treatment has specific conditions — do not assume automatic 50/50 treatment.`,
  }),

  hmrc_self_assessment_p85: () => ({
    riskLevel: 'high',
    contentMarkdown: `**HMRC departure checklist:** P85 where relevant, SA109 for split-year claims, final Self Assessment, PAYE reconciliation, student loan notifications, benefits cessation and address updates.`,
  }),

  property_pension_investments: ({ answers }) => ({
    riskLevel: answers.hasUkProperty === 'yes' || answers.hasUkPensionIsaInvestments === 'yes' ? 'high' : 'medium',
    contentMarkdown: `**UK property:** ${answers.hasUkProperty ?? 'not specified'} · **Pensions/ISA/investments:** ${answers.hasUkPensionIsaInvestments ?? 'not specified'}

Non-residents must report UK property/land disposals. ISA contributions generally stop once non-UK resident. Pension and broker rules need adviser review.`,
  }),

  banking_money: ({ answers }) => ({
    riskLevel: 'medium',
    contentMarkdown: `**Banking status:** ${answers.bankingStatus}

Plan UK account continuity, card delivery abroad, 2FA tied to UK phone numbers, and destination account opening sequence.`,
  }),

  day_one_arrival: ({ answers }) => ({
    riskLevel: answers.moveDate ? 'medium' : 'high',
    contentMarkdown: `**Departure & landing — first 24 hours**

| Phase | What to sort |
|-------|--------------|
| **UK departure morning** | Meter readings, keys handover, mail redirect activation, carry P85/SA109 evidence copies |
| **In transit** | Passport, visa/residence docs, pet travel papers (if applicable), medications in cabin bag |
| **Destination eSIM** | Activate local SIM/eSIM before ride-hailing and landlord OTPs — UK number may still be needed for 2FA |
| **Airport → interim home** | Pre-book transfer; confirm temporary accommodation check-in; small local cash |
| **First night abroad** | Test banking card, save embassy/consulate contacts, photograph meter readings at new interim address |

${answers.destinationCountry ? `**Destination:** ${answers.destinationCountry}${answers.destinationCity ? ` (${answers.destinationCity})` : ''}\n\n` : ''}${answers.temporaryAccommodationNeeds ? `**Interim stay:** ${answers.temporaryAccommodationNeeds}\n\n` : ''}${answers.moveDate ? `**Move anchor:** ${answers.moveDate}` : '**Add your move date** in Inputs to align UK departure and landing checklists.'}${DAY_ONE_PACK_NOTE}`,
  }),
};

export const ROUTE_SECTION_KNOWLEDGE: Partial<Record<RouteKey, RouteSectionKnowledge>> = {
  uk_to_dubai: UK_TO_DUBAI,
  professionals_to_uk: PROFESSIONALS_TO_UK,
  students_to_uk: STUDENTS_TO_UK,
  families_to_uk: FAMILIES_TO_UK,
  leaving_uk: LEAVING_UK,
};

export function routeSectionDraft(
  routeKey: string,
  sectionKey: string,
  ctx: SectionContext,
): SectionDraft | null {
  const knowledge = ROUTE_SECTION_KNOWLEDGE[routeKey as RouteKey];
  const fn = knowledge?.[sectionKey];
  return fn ? fn(ctx) : null;
}

export function checkHiddenDependencies(route: RouteConfig, answers: LivingAnswers): string {
  const draft = routeSectionDraft(route.routeKey, 'hidden_dependencies', {
    route,
    answers,
    baseRisk: 'medium',
  });
  if (draft) return draft.contentMarkdown;

  return `**${route.title} dependencies** are mapped in your Lifeport Plan. Unlock for the full chain.`;
}

export function recommendedPackagesSection(
  route: RouteConfig,
  answers: LivingAnswers,
): SectionDraft {
  const lines = route.packages.slice(0, 6).map((key) => {
    const catalog = PACKAGE_CATALOG[key as PackageKey];
    const reason = packageReasonForRoute(key, route, answers);
    return `- **${catalog?.title ?? sectionTitle(key)}** (from £${catalog?.priceFrom ?? '—'}) — ${reason}`;
  });
  return {
    contentMarkdown: `Based on your move profile, these setup packages are worth considering:\n\n${lines.join('\n')}\n\nRequest packages from the **Packages** tab.`,
  };
}

export function packageReasonForRoute(
  packageKey: string,
  route: RouteConfig,
  answers: LivingAnswers,
): string {
  const reasons: Record<string, string> = {
    banking_readiness:
      answers.bankingStatus === 'not_started'
        ? 'Banking not started — address and immigration proof sequencing needed.'
        : 'Keep banking activation on track.',
    banking_continuity: 'UK account continuity, cards and 2FA risk after departure.',
    tax_residence_packet:
      route.routeKey === 'uk_to_dubai' || route.routeKey === 'leaving_uk'
        ? 'SRT, split-year, P85/SA109 and residence timing need coordinated review.'
        : 'UK arrival-year tax residence and foreign income flags.',
    uk_departure_admin_pack: 'P85, SA109, HMRC and address cutover before departure.',
    housing_ejari_readiness: 'Ejari, DEWA and proof-of-address circular dependency.',
    housing_readiness:
      answers.housingStatus === 'not_started' || answers.accommodationStatus === 'not_started'
        ? 'Housing not secured — right-to-rent and address evidence blocked.'
        : 'Housing readiness review.',
    documents_attestation_pack: 'Apostille and UAE MOFA attestation before departure.',
    documents_family_records_pack: 'Marriage, birth, custody and school records for family moves.',
    healthcare_insurance_setup: 'UAE health insurance linked to residence permit issuance.',
    healthcare_setup: 'NHS/GP registration and prescription continuity.',
    family_arrival_pack:
      answers.householdType === 'family' || answers.hasChildren === 'yes'
        ? 'Family visas, schools and arrival logistics.'
        : 'Family arrival support if dependants join.',
    student_arrival_pack: 'CAS, eVisa, university registration and arrival week.',
    student_document_readiness: 'CAS, visa and transcript readiness.',
    parent_emergency_pack: 'Parent funding safety and scam-aware transfers.',
    safety_scams_pack: 'Arrival fraud patterns and emergency contacts.',
    school_nursery_setup: 'Admissions, catchment and nursery waitlists.',
    pet_relocation_readiness:
      answers.hasPets === 'yes' ? 'MOCCAE import permits and vaccination timing.' : 'Pet import planning.',
    storage_shipping_plan: 'Shipping windows and first-30-days essentials.',
    estate_wills_packet: 'Cross-border wills and guardianship.',
    property_pension_investments_packet: 'UK property, ISA, pension and broker restrictions.',
    credentials_licences_conversion: 'Driving licence exchange and degree recognition.',
    first_90_days_concierge: `Hands-on first-90-days sequencing for ${route.title}.`,
    day_one_arrival_pack:
      answers.moveDate || answers.arrivalDateTime
        ? 'eSIM, airport transfer and first-night essentials for your landing day.'
        : 'Landing-day eSIM, transport routing and first-night checklist — add your arrival date to personalise.',
  };
  return reasons[packageKey] ?? `Recommended for ${route.title}.`;
}
