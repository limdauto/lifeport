const DEV_ADMIN_SECRET = 'dev-admin';

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
