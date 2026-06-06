#!/usr/bin/env node
/**
 * Push backend env vars from .env.local into the Convex deployment.
 * Convex CLI skips NEXT_PUBLIC_* / CONVEX_DEPLOYMENT keys automatically.
 */
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const appDir = fileURLToPath(new URL('..', import.meta.url));
const envFile = `${appDir}/.env.local`;

if (!existsSync(envFile)) {
  console.log('[sync-convex-env] No .env.local — using Convex defaults.');
  process.exit(0);
}

try {
  execSync(`npx convex env set --force --from-file "${envFile}"`, {
    cwd: appDir,
    stdio: 'inherit',
  });
} catch {
  console.warn(
    '[sync-convex-env] Could not sync .env.local to Convex (is convex dev running?).',
  );
  process.exit(0);
}
