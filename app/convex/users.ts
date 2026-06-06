import { getAuthUserId } from '@convex-dev/auth/server';
import { query } from './_generated/server';
import { isAdminEmail } from './lib/adminAuth';

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    const identity = await ctx.auth.getUserIdentity();
    const email = identity?.email ?? user?.email ?? null;

    return {
      userId,
      email,
      name: user?.name ?? identity?.name ?? null,
      isAdmin: isAdminEmail(email),
    };
  },
});

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const user = await ctx.db.get(userId);
    const identity = await ctx.auth.getUserIdentity();
    const email = identity?.email ?? user?.email ?? null;
    return isAdminEmail(email);
  },
});
