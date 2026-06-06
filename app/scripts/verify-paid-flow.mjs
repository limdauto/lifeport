#!/usr/bin/env node
/**
 * Smoke test: check → dev pay → living intake → living report ready.
 * Requires `npm run dev` in app/.
 */
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const appDir = fileURLToPath(new URL('..', import.meta.url));

const intakeArgs = {
  routeKey: 'uk_to_dubai',
  answers: {
    email: `verify-paid-${Date.now()}@lifeport.test`,
    name: 'Paid Verify User',
    originCountry: 'United Kingdom',
    destinationCountry: 'United Arab Emirates',
    destinationCity: 'Dubai',
    moveDate: '2026-09-01',
    householdType: 'family',
    visaStatus: 'in_progress',
    housingStatus: 'not_started',
    bankingStatus: 'not_started',
    hasUkPensionIsaInvestments: 'yes',
    biggestWorry: 'Tax exit timing',
  },
};

function convexRun(fn, payload) {
  const out = execSync(`npx convex run ${fn} '${JSON.stringify(payload)}'`, {
    cwd: appDir,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  return JSON.parse(out.trim());
}

console.log('1. Submitting Lifeport Check…');
const { caseId } = convexRun('intake:submitCheck', intakeArgs);
console.log(`   caseId: ${caseId}`);

console.log('2. Waiting for check…');
for (let i = 0; i < 35; i++) {
  await new Promise((r) => setTimeout(r, 1000));
  const check = convexRun('reports:getCheck', { caseId });
  if (check.report?.status === 'ready') break;
}

console.log('3. Dev checkout…');
convexRun('stripe:completeDevCheckout', { caseId });

console.log('4. Living intake + generation…');
convexRun('intake:submitLivingIntake', {
  caseId,
  livingAnswers: {
    assetsPropertyPension: 'UK ISA + pension',
    employmentStatus: 'Employed',
    taxResidencyHistory: 'UK resident 10 years',
  },
});

console.log('5. Polling living report…');
for (let i = 0; i < 60; i++) {
  await new Promise((r) => setTimeout(r, 1000));
  const living = convexRun('reports:getLivingReport', { caseId });
  const status = living.report?.status;
  const sectionCount = living.sections?.length ?? 0;
  process.stdout.write(`   attempt ${i + 1}: status=${status}, sections=${sectionCount}\r`);
  if ((status === 'ready' || status === 'published') && sectionCount >= 19) {
    console.log(`\n✓ Living Report ready with ${sectionCount} sections`);
    console.log(`  View at: http://localhost:3000/report/${caseId}`);
    process.exit(0);
  }
  if (status === 'needs_review') {
    console.log('\n   Report awaiting founder review — publishing via admin…');
    const detail = convexRun('admin:getCaseAdminDetail', {
      adminSecret: process.env.ADMIN_SECRET ?? 'dev-admin',
      caseId,
    });
    if (detail?.livingReport?._id) {
      convexRun('admin:publishLivingReport', {
        adminSecret: process.env.ADMIN_SECRET ?? 'dev-admin',
        caseId,
        reportId: detail.livingReport._id,
      });
    }
  }
}

console.error('\n✗ Living Report did not become ready in time.');
process.exit(1);
