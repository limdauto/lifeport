#!/usr/bin/env node
/**
 * Smoke test: paid living report → admin publish → customer sees sections.
 * Requires `npm run dev` in app/.
 */
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const appDir = fileURLToPath(new URL('..', import.meta.url));
const adminSecret = process.env.ADMIN_SECRET ?? 'dev-admin';

function convexRun(fn, payload) {
  const out = execSync(`npx convex run ${fn} '${JSON.stringify(payload)}'`, {
    cwd: appDir,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  return JSON.parse(out.trim());
}

const intakeArgs = {
  routeKey: 'uk_to_dubai',
  answers: {
    email: `verify-admin-${Date.now()}@lifeport.test`,
    name: 'Admin Verify User',
    originCountry: 'United Kingdom',
    destinationCountry: 'United Arab Emirates',
    destinationCity: 'Dubai',
    moveDate: '2026-09-01',
    householdType: 'family',
    visaStatus: 'in_progress',
    housingStatus: 'not_started',
    bankingStatus: 'not_started',
    biggestWorry: 'Founder review path',
  },
};

console.log('1. Submitting Lifeport Check…');
const { caseId } = convexRun('intake:submitCheck', intakeArgs);

console.log('2. Waiting for check…');
for (let i = 0; i < 35; i++) {
  await new Promise((r) => setTimeout(r, 1000));
  const check = convexRun('reports:getCheck', { caseId });
  if (check.report?.status === 'ready') break;
}

console.log('3. Dev checkout + living intake…');
convexRun('stripe:completeDevCheckout', { caseId });
convexRun('intake:submitLivingIntake', {
  caseId,
  livingAnswers: { uaeVisaRoute: 'Employment', emiratesIdStatus: 'not_started' },
});

console.log('4. Waiting for living generation…');
let reportId = null;
for (let i = 0; i < 60; i++) {
  await new Promise((r) => setTimeout(r, 1000));
  const detail = convexRun('admin:getCaseAdminDetail', { adminSecret, caseId });
  if (detail?.livingReport?.status === 'needs_review' || detail?.livingReport?.status === 'published') {
    reportId = detail.livingReport._id;
    if ((detail.livingSections?.length ?? 0) >= 18) break;
  }
  if (detail?.livingReport?.status === 'published' && (detail.livingSections?.length ?? 0) >= 18) {
    reportId = detail.livingReport._id;
    break;
  }
}

if (!reportId) {
  console.error('✗ Living report did not finish generating.');
  process.exit(1);
}

const before = convexRun('reports:getLivingReport', { caseId });
const needsPublish = before.awaitingReview || before.report?.status === 'needs_review';

if (needsPublish) {
  console.log('5. Publishing via admin…');
  convexRun('admin:publishLivingReport', { adminSecret, caseId, reportId });
} else {
  console.log('5. Report auto-published (no ADMIN_SECRET on deployment).');
}

console.log('6. Verifying customer delivery…');
for (let i = 0; i < 10; i++) {
  await new Promise((r) => setTimeout(r, 500));
  const living = convexRun('reports:getLivingReport', { caseId });
  const sections = living.sections?.length ?? 0;
  if (!living.awaitingReview && living.report?.status === 'published' && sections >= 18) {
    console.log(`✓ Published living report — ${sections} sections visible to customer`);
    console.log(`  Admin: http://localhost:3000/admin/cases/${caseId}`);
    console.log(`  Customer: http://localhost:3000/report/${caseId}`);
    process.exit(0);
  }
}

console.error('✗ Customer report not published.');
process.exit(1);
