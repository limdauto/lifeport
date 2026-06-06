import { getAuthUserId } from '@convex-dev/auth/server';
import type { ActionCtx, MutationCtx, QueryCtx } from '../_generated/server';

const DEV_ADMIN_SECRET = 'dev-admin';

type AuthCtx = QueryCtx | MutationCtx | ActionCtx;

export function assertAdminSecret(secret: string): void {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) {
    if (secret !== DEV_ADMIN_SECRET) {
      throw new Error('Unauthorized');
    }
    return;
  }
  if (secret !== expected) {
    throw new Error('Unauthorized');
  }
}

export function devAdminSecretHint(): string {
  return process.env.ADMIN_SECRET ? '' : DEV_ADMIN_SECRET;
}

/** Comma-separated ADMIN_EMAILS, or dev default when founder review secret is unset. */
export function configuredAdminEmails(): string[] {
  const fromEnv = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (fromEnv.length > 0) return fromEnv;
  if (!process.env.ADMIN_SECRET) {
    const devEmail = process.env.DEV_ADMIN_EMAIL?.trim().toLowerCase();
    return [devEmail || 'admin@lifeport.local'];
  }
  return [];
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return configuredAdminEmails().includes(email.trim().toLowerCase());
}

/** Match viewer query — password auth stores email on users, not always on the JWT. */
export async function resolveSessionEmail(ctx: AuthCtx): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity?.email) return identity.email.trim().toLowerCase();

  const userId = await getAuthUserId(ctx);
  if (!userId || !('db' in ctx)) return null;

  const user = await ctx.db.get(userId);
  return user?.email?.trim().toLowerCase() ?? null;
}

export async function assertAdmin(ctx: AuthCtx, adminSecret?: string): Promise<void> {
  if (adminSecret) {
    assertAdminSecret(adminSecret);
    return;
  }

  const email = await resolveSessionEmail(ctx);
  if (!email || !isAdminEmail(email)) {
    throw new Error('Unauthorized');
  }
}
