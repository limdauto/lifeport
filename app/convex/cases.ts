import { v } from 'convex/values';
import { internalMutation, internalQuery, query } from './_generated/server';
import { getRouteByKey } from './lib/routeConfigs';

export const getCaseInternal = internalQuery({
  args: { caseId: v.id('cases') },
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get(args.caseId);
    if (!caseDoc) return null;

    const profile = await ctx.db
      .query('moveProfiles')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .order('desc')
      .first();

    return { ...caseDoc, profile };
  },
});

export const patchJobRunning = internalMutation({
  args: { jobId: v.id('generationJobs') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, { status: 'running', updatedAt: Date.now() });
  },
});

export const getMyCase = query({
  args: { caseId: v.id('cases') },
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get(args.caseId);
    if (!caseDoc) return null;

    const route = getRouteByKey(caseDoc.routeKey);
    const profile = await ctx.db
      .query('moveProfiles')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .order('desc')
      .first();

    const latestJob = await ctx.db
      .query('generationJobs')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .order('desc')
      .first();

    return {
      ...caseDoc,
      route,
      profile,
      latestJob,
    };
  },
});
