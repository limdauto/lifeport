/** Visual system aligned with stitch_lifeport_relocation_platform/report_design */

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

const SECTION_ICONS: Record<string, string> = {
  move_summary: 'person',
  move_profile: 'person',
  executive_brief: 'person',
  top_findings: 'search',
  hidden_dependencies: 'account_tree',
  likely_friction_areas: 'warning',
  risk_map: 'warning',
  friction_points: 'warning',
  recommended_next_step: 'lightbulb',
  premium_preview: 'workspace_premium',
  recommended_packages: 'inventory_2',
  timeline: 'schedule',
  change_log: 'history',
  expert_questions: 'help',
  first_90_days: 'event',
  day_one_arrival: 'flight_land',
  first_week_first_term: 'school',
};

export function sectionIcon(sectionKey: string): string {
  return SECTION_ICONS[sectionKey] ?? 'article';
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
