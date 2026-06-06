/** Fallbacks when .env.local vars are not synced yet. */
export const DEV_ADMIN_EMAIL = 'admin@lifeport.local';
export const DEV_ADMIN_PASSWORD = 'lifeport-dev';

export function devAdminEmail(): string {
  const fromDev = process.env.DEV_ADMIN_EMAIL?.trim().toLowerCase();
  if (fromDev) return fromDev;

  const fromList = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .find(Boolean);
  if (fromList) return fromList;

  return DEV_ADMIN_EMAIL;
}

export function devAdminPassword(): string {
  return process.env.DEV_ADMIN_PASSWORD ?? DEV_ADMIN_PASSWORD;
}

function isLocalConvexBackend(): boolean {
  const cloud = process.env.CONVEX_CLOUD_URL ?? '';
  return cloud.includes('127.0.0.1') || cloud.includes('localhost');
}

/** True only on local Convex or when explicitly opted in — never on production cloud. */
export function isDevAdminSeedEnabled(): boolean {
  if (process.env.ADMIN_SECRET) return false;
  if (process.env.DISABLE_DEV_ADMIN_SEED === 'true') return false;
  if (process.env.ALLOW_DEV_ADMIN_SEED === 'true') return true;
  return isLocalConvexBackend();
}

export function devSeedCredentials():
  | { email: string; password: string }
  | undefined {
  if (!isDevAdminSeedEnabled()) return undefined;
  return {
    email: devAdminEmail(),
    password: devAdminPassword(),
  };
}
