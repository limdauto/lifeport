export interface RouteConfig {
  slug: string;
  label: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  planCoverage: string[];
  employerItems: string[];
  yourItems: string[];
  riskFlags: { title: string; description: string }[];
  protocols: { title: string; description: string }[];
}

export const routes: RouteConfig[] = [
  {
    slug: 'professionals',
    label: 'Use-Case',
    badge: 'UK Arrival Route',
    title: 'Your company moves your job. You have to move your life.',
    description:
      'We prepare a personalised Lifeport Plan PDF for your UK arrival — banking, tax, housing, healthcare, and the gaps your employer won\'t cover.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=280&fit=crop&q=80',
    imageAlt: 'London skyline',
    planCoverage: [
      'Visa & immigration sequencing',
      'UK banking and address paradox',
      'Tax residence transition',
      'Housing, GP, and first 90 days',
    ],
    employerItems: [
      'Work Visa Application',
      'Initial Flights',
      'Corporate Tax Setup',
      'Office Access',
    ],
    yourItems: [
      'Bank Account (without proof of address)',
      'GP Registration',
      'Tax Residence',
      'Housing & Lease',
      'Childcare & Schooling',
      'Estate Planning',
    ],
    riskFlags: [
      {
        title: 'Split-Year Tax Treatment',
        description: 'Potential dual-residency in your transition year.',
      },
      {
        title: 'The Address Paradox',
        description: 'Need an address for banking, but a lease needs a bank account.',
      },
      {
        title: 'Childcare Logistics',
        description: 'Nursery waitlists can run 6 months ahead of arrival.',
      },
    ],
    protocols: [
      { title: 'Housing & Guarantors', description: 'Credit history and deposit requirements.' },
      { title: 'NHS & Healthcare', description: 'Registration and family coverage steps.' },
      { title: 'Family Logistics', description: 'Spouse visas and dependent sequencing.' },
    ],
  },
  {
    slug: 'uk-to-dubai',
    label: 'Popular Route',
    badge: 'UK to Dubai Route',
    title: 'Leave the UK. Land with a plan, not a paperwork pile.',
    description:
      'A personalised Lifeport Plan PDF for tax-efficient relocation — residency, banking, housing, and asset structuring sequenced before you fly.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&h=280&fit=crop&q=80',
    imageAlt: 'Dubai skyline at dusk',
    planCoverage: [
      'UK exit tax and residency timing',
      'UAE visa and residency route',
      'Banking and salary account setup',
      'Housing, Ejari, and asset continuity',
    ],
    employerItems: [
      'Employment Contract (UAE entity)',
      'Relocation Allowance',
      'Corporate Immigration Sponsor',
    ],
    yourItems: [
      'UK Tax Exit & Remittance Basis',
      'UAE Personal Bank Account',
      'Tenancy & Ejari Registration',
      'Health Insurance & Emirates ID',
      'Asset & Will Restructuring',
      'Schooling (if relocating family)',
    ],
    riskFlags: [
      {
        title: 'UK Departure Year Tax',
        description: 'Split-year and remittance basis decisions must be timed correctly.',
      },
      {
        title: 'Residency Clock',
        description: 'Days in the UK can affect your non-resident status claim.',
      },
      {
        title: 'Banking Lead Time',
        description: 'Personal accounts often require residency docs before salary credit.',
      },
    ],
    protocols: [
      { title: 'Golden / Skilled Visa Path', description: 'Route selection and document sequencing.' },
      { title: 'Property & Ejari', description: 'Lease, deposit, and utility setup order.' },
      { title: 'Cross-Border Assets', description: 'Pensions, property, and investment continuity.' },
    ],
  },
  {
    slug: 'families-uk',
    label: 'Complex Move',
    badge: 'Families · UK Arrival',
    title: 'One move. Three visas. Six systems that don\'t talk to each other.',
    description:
      'We map your family\'s full critical path into one Lifeport Plan PDF — schools, spouse visas, nurseries, and housing dependencies included.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500&h=280&fit=crop&q=80',
    imageAlt: 'Family walking in a UK park',
    planCoverage: [
      'Primary and dependent visa sequencing',
      'School catchment and nursery waitlists',
      'Family housing and banking',
      'GP registration and child benefits',
    ],
    employerItems: [
      'Primary Applicant Work Visa',
      'Initial Family Flights',
      'Corporate Relocation Briefing',
    ],
    yourItems: [
      'Spouse & Dependent Visas',
      'School & Nursery Registration',
      'Family GP Registration',
      'Housing with School Catchment',
      'Child Benefit & Tax Credits',
      'Family Banking & Budgeting',
    ],
    riskFlags: [
      {
        title: 'Spouse Visa Dependency',
        description: 'Partner status is chained to the primary applicant\'s visa and address.',
      },
      {
        title: 'Catchment vs. Lease',
        description: 'School places depend on an address you may not have yet.',
      },
      {
        title: 'Nursery Waitlist Gap',
        description: 'Popular nurseries are often full 6 months before your arrival date.',
      },
    ],
    protocols: [
      { title: 'Dependent Visa Sequencing', description: 'Order of applications across the family.' },
      { title: 'School & Nursery Pipeline', description: 'Registration windows and waitlist strategy.' },
      { title: 'Family Banking Setup', description: 'Joint accounts, credit, and household budgeting.' },
    ],
  },
];

export function getRoute(slug: string): RouteConfig | undefined {
  return routes.find((r) => r.slug === slug);
}
