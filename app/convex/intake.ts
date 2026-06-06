import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { internal } from './_generated/api';
import {
  affectedSectionsForChanges,
  changeSummaryForSections,
} from './lib/sectionDependencies';
import { getRouteByKey } from './lib/routeConfigs';

export const submitCheck = mutation({
  args: {
    routeKey: v.string(),
    answers: v.any(),
  },
  handler: async (ctx, args) => {
    const route = getRouteByKey(args.routeKey);
    if (!route) throw new Error(`Unknown route: ${args.routeKey}`);

    const answers = args.answers as Record<string, string>;
    const email = answers.email?.trim().toLowerCase();
    const name = answers.name?.trim();
    if (!email || !name) throw new Error('Email and name are required');
    if (!answers.biggestWorry?.trim()) throw new Error('Biggest worry is required');

    const now = Date.now();

    let user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email))
      .unique();

    if (!user) {
      const userId = await ctx.db.insert('users', {
        email,
        name,
        createdAt: now,
        updatedAt: now,
      });
      user = (await ctx.db.get(userId))!;
    } else {
      await ctx.db.patch(user._id, { name, updatedAt: now });
    }

    const caseId = await ctx.db.insert('cases', {
      userId: user._id,
      email,
      name,
      routeKey: args.routeKey,
      originCountry: answers.originCountry ?? '',
      destinationCountry: answers.destinationCountry ?? '',
      moveDate: answers.moveDate || undefined,
      status: 'check_generating',
      paymentStatus: 'unpaid',
      reportStatus: 'generating',
      createdAt: now,
      updatedAt: now,
    });

    const rawAnswers = { routeKey: args.routeKey, ...answers };

    await ctx.db.insert('moveProfiles', {
      caseId,
      rawAnswers,
      normalizedProfile: {
        routeKey: args.routeKey,
        householdType: answers.householdType,
        visaStatus: answers.visaStatus ?? answers.primaryApplicantVisaStatus,
        housingStatus: answers.housingStatus ?? answers.accommodationStatus,
        bankingStatus: answers.bankingStatus,
      },
      missingInfo: [],
      version: 1,
      updatedAt: now,
    });

    const reportId = await ctx.db.insert('reports', {
      caseId,
      type: 'check',
      status: 'generating',
      version: 1,
      title: `Your Lifeport Check — ${route.title}`,
      createdAt: now,
      updatedAt: now,
    });

    const jobId = await ctx.db.insert('generationJobs', {
      caseId,
      reportId,
      type: 'check',
      status: 'queued',
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert('auditEvents', {
      caseId,
      eventType: 'check_submitted',
      payload: { routeKey: args.routeKey },
      createdAt: now,
    });

    await ctx.scheduler.runAfter(0, internal.generation.generateCheck, {
      caseId,
      reportId,
      jobId,
    });

    return { caseId, reportId };
  },
});

export const retryCheckGeneration = mutation({
  args: { caseId: v.id('cases') },
  handler: async (ctx, args) => {
    const report = await ctx.db
      .query('reports')
      .withIndex('by_case_type', (q) => q.eq('caseId', args.caseId).eq('type', 'check'))
      .order('desc')
      .first();

    if (!report) throw new Error('Lifeport Check not found');
    if (report.status === 'ready') return { status: 'already_ready' as const };

    const now = Date.now();
    const jobId = await ctx.db.insert('generationJobs', {
      caseId: args.caseId,
      reportId: report._id,
      type: 'check',
      status: 'queued',
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(report._id, { status: 'generating', updatedAt: now });
    await ctx.db.patch(args.caseId, {
      status: 'check_generating',
      reportStatus: 'generating',
      updatedAt: now,
    });

    await ctx.scheduler.runAfter(0, internal.generation.generateCheck, {
      caseId: args.caseId,
      reportId: report._id,
      jobId,
    });

    return { status: 'retrying' as const };
  },
});

export const saveCheckAnswers = mutation({
  args: {
    caseId: v.id('cases'),
    rawAnswers: v.any(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query('moveProfiles')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .order('desc')
      .first();

    if (!profile) throw new Error('Move profile not found');

    await ctx.db.patch(profile._id, {
      rawAnswers: args.rawAnswers,
      version: profile.version + 1,
      updatedAt: Date.now(),
    });
  },
});

export const submitLivingIntake = mutation({
  args: {
    caseId: v.id('cases'),
    livingAnswers: v.any(),
  },
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get(args.caseId);
    if (!caseDoc) throw new Error('Case not found');
    if (caseDoc.paymentStatus !== 'paid') throw new Error('Living Report requires payment');

    const profile = await ctx.db
      .query('moveProfiles')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .order('desc')
      .first();
    if (!profile) throw new Error('Move profile not found');

    const route = getRouteByKey(caseDoc.routeKey);
    if (!route) throw new Error('Route not found');

    const now = Date.now();
    const rawAnswers = {
      ...(profile.rawAnswers as Record<string, unknown>),
      ...(args.livingAnswers as Record<string, unknown>),
    };

    await ctx.db.patch(profile._id, {
      rawAnswers,
      version: profile.version + 1,
      updatedAt: now,
    });

    await ctx.db.patch(caseDoc._id, {
      status: 'living_generating',
      reportStatus: 'living_generating',
      updatedAt: now,
    });

    const reportId = await ctx.db.insert('reports', {
      caseId: args.caseId,
      type: 'living',
      status: 'generating',
      version: 1,
      title: `Your Living Report — ${route.title}`,
      createdAt: now,
      updatedAt: now,
    });

    const jobId = await ctx.db.insert('generationJobs', {
      caseId: args.caseId,
      reportId,
      type: 'living',
      status: 'queued',
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert('auditEvents', {
      caseId: args.caseId,
      eventType: 'living_intake_submitted',
      payload: { reportId },
      createdAt: now,
    });

    await ctx.scheduler.runAfter(0, internal.generation.generateLiving, {
      caseId: args.caseId,
      reportId,
      jobId,
    });

    return { reportId };
  },
});

export const updateMoveProfile = mutation({
  args: {
    caseId: v.id('cases'),
    updates: v.any(),
  },
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get(args.caseId);
    if (!caseDoc) throw new Error('Case not found');
    if (caseDoc.paymentStatus !== 'paid') throw new Error('Living Report requires payment');

    const profile = await ctx.db
      .query('moveProfiles')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .order('desc')
      .first();
    if (!profile) throw new Error('Move profile not found');

    const route = getRouteByKey(caseDoc.routeKey);
    if (!route) throw new Error('Route not found');

    const updates = args.updates as Record<string, unknown>;
    const available = [...route.reportSections, 'expert_questions', 'change_log'];
    const affected = affectedSectionsForChanges(updates, available);
    const changeSummary = changeSummaryForSections(affected);

    const now = Date.now();
    const rawAnswers = {
      ...(profile.rawAnswers as Record<string, unknown>),
      ...updates,
    };

    if (updates.moveDate && typeof updates.moveDate === 'string') {
      await ctx.db.patch(caseDoc._id, { moveDate: updates.moveDate, updatedAt: now });
    }

    await ctx.db.patch(profile._id, {
      rawAnswers,
      version: profile.version + 1,
      pendingAffectedSections: affected,
      pendingChangeSummary: changeSummary,
      updatedAt: now,
    });

    await ctx.db.insert('auditEvents', {
      caseId: args.caseId,
      eventType: 'profile_updated',
      payload: { affectedSections: affected, version: profile.version + 1 },
      createdAt: now,
    });

    return { affectedSections: affected, changeSummary };
  },
});

export const requestRegeneration = mutation({
  args: { caseId: v.id('cases') },
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get(args.caseId);
    if (!caseDoc) throw new Error('Case not found');
    if (caseDoc.paymentStatus !== 'paid') throw new Error('Living Report requires payment');

    const profile = await ctx.db
      .query('moveProfiles')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .order('desc')
      .first();
    if (!profile) throw new Error('Move profile not found');

    const affected = profile.pendingAffectedSections ?? [];
    if (affected.length === 0) {
      return { status: 'nothing_to_regenerate' as const };
    }

    const report = await ctx.db
      .query('reports')
      .withIndex('by_case_type', (q) => q.eq('caseId', args.caseId).eq('type', 'living'))
      .order('desc')
      .first();
    if (!report) throw new Error('Living Report not found');

    const now = Date.now();
    const jobId = await ctx.db.insert('generationJobs', {
      caseId: args.caseId,
      reportId: report._id,
      type: 'section_regeneration',
      status: 'queued',
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(report._id, { status: 'generating', updatedAt: now });
    await ctx.db.patch(caseDoc._id, {
      status: 'living_generating',
      reportStatus: 'living_generating',
      updatedAt: now,
    });

    await ctx.scheduler.runAfter(0, internal.generation.generateLiving, {
      caseId: args.caseId,
      reportId: report._id,
      jobId,
      sectionKeys: affected,
      changeSummary: profile.pendingChangeSummary ?? 'Report sections updated.',
    });

    return { status: 'regenerating' as const, affectedSections: affected };
  },
});
