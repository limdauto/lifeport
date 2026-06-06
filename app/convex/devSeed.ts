import { createAccount } from '@convex-dev/auth/server';
import { internalAction } from './_generated/server';
import { devAdminEmail, devAdminPassword, isDevAdminSeedEnabled } from './lib/devSeed';

export const seedDevAdmin = internalAction({
  args: {},
  handler: async (ctx) => {
    if (!isDevAdminSeedEnabled()) {
      console.log('[devSeed] Skipped — not a local dev deployment.');
      return { seeded: false as const, reason: 'disabled' as const };
    }

    const email = devAdminEmail();
    const password = devAdminPassword();

    try {
      const { user } = await createAccount(ctx, {
        provider: 'password',
        account: { id: email, secret: password },
        profile: {
          email,
          name: 'Lifeport Admin',
          role: 'admin',
        },
      });

      console.log(`[devSeed] Admin ready: ${email}`);
      return { seeded: true as const, email, userId: user._id };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('already exists')) {
        console.log(`[devSeed] Admin already exists: ${email}`);
        return { seeded: false as const, reason: 'exists' as const, email };
      }
      throw error;
    }
  },
});
