import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const getRecommendations = query({
  args: { caseId: v.id('cases') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('packageRecommendations')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .collect();
  },
});

export const requestPackage = mutation({
  args: {
    caseId: v.id('cases'),
    packageKey: v.string(),
  },
  handler: async (ctx, args) => {
    const pkg = await ctx.db
      .query('packageRecommendations')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .collect();

    const match = pkg.find((p) => p.packageKey === args.packageKey);
    if (!match) throw new Error('Package not found');

    const now = Date.now();
    await ctx.db.patch(match._id, { status: 'requested', updatedAt: now });

    await ctx.db.insert('auditEvents', {
      caseId: args.caseId,
      eventType: 'package_requested',
      payload: { packageKey: args.packageKey },
      createdAt: now,
    });

    return { status: 'requested' as const };
  },
});
