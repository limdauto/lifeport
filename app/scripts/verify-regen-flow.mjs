#!/usr/bin/env node
/**
 * Smoke test: paid living report → profile update → section regeneration.
 * Requires `npm run dev` in app/.
 */
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const appDir = fileURLToPath(new URL('..', import.meta.url));

const intakeArgs = {
  routeKey: 'uk_to_dubai',
  answers: {
    email: `verify-regen-${Date.now()}@lifeport.test`,
    name: 'Regen Verify User',
    originCountry: 'United Kingdom',
    destinationCountry: 'United Arab Emirates',
    destinationCity: 'Dubai',
    moveDate: '2026-09-01',
    householdType: 'family',
    visaStatus: 'in_progress',
    housingStatus: 'not_started',
    bankingStatus: 'not_started',
    biggestWorry: 'Ejari timing',
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

console.log('4. Living intake…');
convexRun('intake:submitLivingIntake', {
  caseId,
  livingAnswers: {
    emiratesIdStatus: 'not_started',
    ejariStatus: 'not_started',
    uaeHousingPlan: 'Marina or JVC, 2-bed',
  },
});

console.log('5. Waiting for living report…');
let baselineSections = 0;
for (let i = 0; i < 60; i++) {
  await new Promise((r) => setTimeout(r, 1000));
  const living = convexRun('reports:getLivingReport', { caseId });
  baselineSections = living.sections?.length ?? 0;
  if (living.report?.status === 'ready' && baselineSections >= 19) break;
}
console.log(`   baseline sections: ${baselineSections}`);

console.log('6. Updating move date (should affect timeline + tax)…');
const update = convexRun('intake:updateMoveProfile', {
  caseId,
  updates: { moveDate: '2026-11-15' },
});
console.log(`   affected: ${update.affectedSections.join(', ')}`);
if (update.affectedSections.length === 0) {
  console.error('✗ Expected affected sections after moveDate change.');
  process.exit(1);
}

console.log('7. Requesting regeneration…');
convexRun('intake:requestRegeneration', { caseId });

console.log('8. Polling regen completion…');
for (let i = 0; i < 40; i++) {
  await new Promise((r) => setTimeout(r, 1000));
  const living = convexRun('reports:getLivingReport', { caseId });
  const status = living.report?.status;
  const pending = living.pendingAffectedSections?.length ?? 0;
  const versions = living.versions?.length ?? 0;
  process.stdout.write(
    `   attempt ${i + 1}: status=${status}, pending=${pending}, versions=${versions}\r`,
  );
  if (status === 'ready' && pending === 0 && versions >= 1) {
    console.log(`\n✓ Regeneration complete — ${living.sections?.length ?? 0} sections, ${versions} version(s)`);
    console.log(`  View at: http://localhost:3000/report/${caseId}`);
    process.exit(0);
  }
}

console.error('\n✗ Regeneration did not complete in time.');
process.exit(1);
