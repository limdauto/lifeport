#!/usr/bin/env node
/**
 * Ensure Convex Auth JWT keys exist in .env.local (generated once per machine).
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { exportJWK, exportPKCS8, generateKeyPair } from 'jose';
import { fileURLToPath } from 'node:url';

const appDir = fileURLToPath(new URL('..', import.meta.url));
const envFile = `${appDir}/.env.local`;

function parseEnv(content) {
  const vars = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    vars[key] = value;
  }
  return vars;
}

function convexEnvGet(name) {
  try {
    return execSync(`npx convex env get ${name}`, {
      cwd: appDir,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return '';
  }
}

async function generateKeys() {
  const keys = await generateKeyPair('RS256');
  const privateKey = await exportPKCS8(keys.privateKey);
  const publicKey = await exportJWK(keys.publicKey);
  return {
    JWT_PRIVATE_KEY: privateKey.trimEnd().replace(/\n/g, ' '),
    JWKS: JSON.stringify({ keys: [{ use: 'sig', ...publicKey }] }),
  };
}

function formatEnvLine(name, value) {
  if (name === 'JWKS') {
    return `${name}='${value.replace(/'/g, "\\'")}'`;
  }
  const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `${name}="${escaped}"`;
}

function stripAuthKeysFromEnv(content) {
  return content
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      return (
        !trimmed.startsWith('JWT_PRIVATE_KEY=') &&
        !trimmed.startsWith('JWKS=') &&
        trimmed !== '# Convex Auth (auto-generated)'
      );
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd();
}

function appendToEnvFile(lines) {
  const existing = existsSync(envFile) ? stripAuthKeysFromEnv(readFileSync(envFile, 'utf8')) : '';
  const separator = existing.length > 0 ? '\n' : '';
  writeFileSync(
    envFile,
    `${existing}${separator}\n# Convex Auth (auto-generated)\n${lines.join('\n')}\n`,
  );
}

const fileVars = existsSync(envFile) ? parseEnv(readFileSync(envFile, 'utf8')) : {};
let jwtPrivateKey = fileVars.JWT_PRIVATE_KEY ?? '';
let jwks = fileVars.JWKS ?? '';

function isValidJwks(value) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed.keys) && parsed.keys.length > 0;
  } catch {
    return false;
  }
}

if (!jwtPrivateKey) jwtPrivateKey = convexEnvGet('JWT_PRIVATE_KEY');
if (!jwks) jwks = convexEnvGet('JWKS');

if (jwtPrivateKey && jwks && isValidJwks(jwks)) {
  if (!fileVars.JWT_PRIVATE_KEY || !fileVars.JWKS) {
    appendToEnvFile([
      formatEnvLine('JWT_PRIVATE_KEY', jwtPrivateKey),
      formatEnvLine('JWKS', jwks),
    ]);
    console.log('[ensure-auth-keys] Copied existing JWT keys into .env.local');
  }
  process.exit(0);
}

const generated = await generateKeys();
appendToEnvFile([
  formatEnvLine('JWT_PRIVATE_KEY', generated.JWT_PRIVATE_KEY),
  formatEnvLine('JWKS', generated.JWKS),
]);
console.log('[ensure-auth-keys] Generated JWT_PRIVATE_KEY and JWKS in .env.local');
