import { FREE_PRODUCT_NAME, PAID_PRODUCT_NAME } from '@/lib/copy';

/** User-facing labels for internal workflow codes — never show raw snake_case in UI. */

const CASE_STATUS: Record<string, string> = {
  check_started: 'Check started',
  check_generating: `Generating ${FREE_PRODUCT_NAME}`,
  check_ready: `${FREE_PRODUCT_NAME} ready`,
  upgrade_started: `Unlocking ${PAID_PRODUCT_NAME}`,
  paid: `${PAID_PRODUCT_NAME} unlocked`,
  living_intake_started: 'Plan setup in progress',
  living_generating: `Generating ${PAID_PRODUCT_NAME}`,
  living_needs_review: 'Awaiting review',
  living_published: `${PAID_PRODUCT_NAME} published`,
  living_ready: `${PAID_PRODUCT_NAME} ready`,
};

const REPORT_STATUS: Record<string, string> = {
  generating: 'Generating',
  ready: 'Ready',
  needs_review: 'Awaiting review',
  published: 'Published',
  failed: 'Failed',
};

const SECTION_STATUS: Record<string, string> = {
  generated: 'Draft',
  missing_info: 'Missing info',
  needs_review: 'Awaiting review',
  published: 'Published',
  locked: 'Locked',
};

const PACKAGE_STATUS: Record<string, string> = {
  recommended: 'Recommended',
  requested: 'Requested',
  paid: 'Paid',
  in_progress: 'In progress',
  completed: 'Completed',
};

const JOB_TYPE: Record<string, string> = {
  check: FREE_PRODUCT_NAME,
  living: PAID_PRODUCT_NAME,
  section_regeneration: 'Section update',
};

const JOB_STATUS: Record<string, string> = {
  queued: 'Queued',
  running: 'Running',
  succeeded: 'Complete',
  failed: 'Failed',
};

const PAYMENT_STATUS: Record<string, string> = {
  unpaid: 'Unpaid',
  checkout_started: 'Checkout started',
  paid: 'Paid',
  failed: 'Payment failed',
  refunded: 'Refunded',
};

function lookup(map: Record<string, string>, code: string): string {
  return map[code] ?? titleCase(code);
}

function titleCase(code: string): string {
  return code
    .replace(/^living_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function caseStatusLabel(status: string): string {
  return lookup(CASE_STATUS, status);
}

export function reportStatusLabel(status: string): string {
  return lookup(REPORT_STATUS, status);
}

export function sectionStatusLabel(status: string): string {
  return lookup(SECTION_STATUS, status);
}

export function packageStatusLabel(status: string): string {
  return lookup(PACKAGE_STATUS, status);
}

export function jobTypeLabel(type: string): string {
  return lookup(JOB_TYPE, type);
}

export function jobStatusLabel(status: string): string {
  return lookup(JOB_STATUS, status);
}

export function paymentStatusLabel(status: string): string {
  return lookup(PAYMENT_STATUS, status);
}

/** Badge color tokens keyed by internal case status. */
export function caseStatusTone(status: string): string {
  const tones: Record<string, string> = {
    living_needs_review: 'bg-tertiary-container text-on-tertiary-container',
    living_published: 'bg-primary-container text-on-primary-container',
    living_ready: 'bg-primary-container text-on-primary-container',
    living_generating: 'bg-surface-container-high text-on-surface-variant',
    check_ready: 'bg-surface-container-high text-on-surface-variant',
    paid: 'bg-surface-container-high text-on-surface-variant',
  };
  return tones[status] ?? 'bg-surface-container-high text-on-surface-variant';
}
