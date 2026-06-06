#!/usr/bin/env node
/**
 * Patch @opennextjs/cloudflare so Convex's Node `ws` import is shimmed for Workers.
 * Idempotent — safe to run before every `opennextjs-cloudflare build`.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const appDir = join(fileURLToPath(new URL('..', import.meta.url)));
const pkgDir = join(appDir, 'node_modules/@opennextjs/cloudflare/dist');
const bundleServerPath = join(pkgDir, 'cli/build/bundle-server.js');
const shimSource = join(appDir, 'cloudflare/shims/ws.js');
const shimTargetDir = join(pkgDir, 'cli/templates/shims');
const shimTarget = join(shimTargetDir, 'ws.js');

if (!existsSync(bundleServerPath)) {
  console.error('[prepare-cf-build] @opennextjs/cloudflare not installed.');
  process.exit(1);
}

mkdirSync(shimTargetDir, { recursive: true });
copyFileSync(shimSource, shimTarget);

let bundleServer = readFileSync(bundleServerPath, 'utf8');
const patchMarker = 'lifeport-convex-worker-shims';
const extraAliases = `
            // ${patchMarker}
            "ws": path.join(buildOpts.outputDir, "cloudflare-templates/shims/ws.js"),
            "convex/dist/esm/browser/simple_client-node.js": path.join(buildOpts.appPath, "node_modules/convex/dist/esm/browser/simple_client.js"),
            "convex/dist/cjs/browser/simple_client-node.js": path.join(buildOpts.appPath, "node_modules/convex/dist/cjs/browser/simple_client.js"),
            "convex/dist/esm/browser/index-node.js": path.join(buildOpts.appPath, "node_modules/convex/dist/esm/browser/index.js"),
            "convex/dist/cjs/browser/index-node.js": path.join(buildOpts.appPath, "node_modules/convex/dist/cjs/browser/index.js"),`;

if (!bundleServer.includes(patchMarker)) {
  const needle = `"next/dist/compiled/ws": path.join(buildOpts.outputDir, "cloudflare-templates/shims/empty.js"),`;
  if (!bundleServer.includes(needle)) {
    console.error('[prepare-cf-build] Could not find alias anchor in bundle-server.js');
    process.exit(1);
  }
  bundleServer = bundleServer.replace(needle, `${needle}${extraAliases}`);
  writeFileSync(bundleServerPath, bundleServer);
  console.log('[prepare-cf-build] Patched OpenNext bundle-server Convex/ws aliases.');
} else {
  console.log('[prepare-cf-build] OpenNext Convex/ws aliases already patched.');
}
