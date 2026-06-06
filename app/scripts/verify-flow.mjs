#!/usr/bin/env node
/**
 * Smoke test: submit a Lifeport Check and poll until sections are ready.
 * Requires Convex local backend running (npm run dev in app/).
 */
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const appDir = fileURLToPath(new URL('..', import.meta.url));

const args = {
  routeKey: 'uk_to_dubai',
  answers: {
    email: `verify-${Date.now()}@lifeport.test`,
    name: 'Verify User',
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

console.log('1. Submitting Lifeport Check intake…');
const { caseId } = convexRun('intake:submitCheck', args);
console.log(`   caseId: ${caseId}`);

console.log('2. Polling for generated report…');
for (let i = 0; i < 35; i++) {
  await new Promise((r) => setTimeout(r, 1000));
  const check = convexRun('reports:getCheck', { caseId });
  const status = check.report.status;
  const sectionCount = check.sections?.length ?? 0;
  process.stdout.write(`   attempt ${i + 1}: status=${status}, sections=${sectionCount}\r`);
  if (status === 'ready' && sectionCount >= 5) {
    console.log(`\n✓ Lifeport Check ready with ${sectionCount} sections and ${check.packages?.length ?? 0} packages`);
    console.log(`  View at: http://localhost:3000/check/result/${caseId}`);
    process.exit(0);
  }
}

console.error('\n✗ Lifeport Check did not become ready in time. Is `npm run dev` running in app/?');
process.exit(1);
