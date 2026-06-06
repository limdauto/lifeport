import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { assertAdminSecret } from './lib/adminAuth';
import { getRouteByKey } from './lib/routeConfigs';

const adminSecretArg = { adminSecret: v.string() };

export const getAdminConfig = query({
  args: {},
  handler: async () => {
    return {
      founderReviewEnabled: Boolean(process.env.ADMIN_SECRET),
      devLoginHint: process.env.ADMIN_SECRET ? undefined : 'dev-admin',
    };
  },
});

export const listCases = query({
  args: {
    ...adminSecretArg,
    filter: v.optional(
      v.union(
        v.literal('all'),
        v.literal('needs_review'),
        v.literal('published'),
        v.literal('package_requests'),
      ),
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    assertAdminSecret(args.adminSecret);
    const limit = args.limit ?? 50;
    const filter = args.filter ?? 'all';

    let cases = await ctx.db.query('cases').order('desc').take(200);

    if (filter === 'needs_review') {
      cases = cases.filter((c) => c.status === 'living_needs_review');
    } else if (filter === 'published') {
      cases = cases.filter((c) => c.status === 'living_published' || c.status === 'living_ready');
    } else if (filter === 'package_requests') {
      const requested = await ctx.db
        .query('packageRecommendations')
        .filter((q) => q.eq(q.field('status'), 'requested'))
        .collect();
      const caseIds = new Set(requested.map((p) => p.caseId));
      cases = cases.filter((c) => caseIds.has(c._id));
    }

    const slice = cases.slice(0, limit);

    return await Promise.all(
      slice.map(async (caseDoc) => {
        const route = getRouteByKey(caseDoc.routeKey);
        const livingReport = await ctx.db
          .query('reports')
          .withIndex('by_case_type', (q) => q.eq('caseId', caseDoc._id).eq('type', 'living'))
          .order('desc')
          .first();
        const checkReport = await ctx.db
          .query('reports')
          .withIndex('by_case_type', (q) => q.eq('caseId', caseDoc._id).eq('type', 'check'))
          .order('desc')
          .first();
        const packages = await ctx.db
          .query('packageRecommendations')
          .withIndex('by_case', (q) => q.eq('caseId', caseDoc._id))
          .collect();
        const requestedPackages = packages.filter((p) => p.status === 'requested').length;

        return {
          ...caseDoc,
          routeTitle: route?.title ?? caseDoc.routeKey,
          checkStatus: checkReport?.status,
          livingStatus: livingReport?.status,
          livingReportId: livingReport?._id,
          requestedPackages,
        };
      }),
    );
  },
});

export const getCaseAdminDetail = query({
  args: {
    ...adminSecretArg,
    caseId: v.id('cases'),
  },
  handler: async (ctx, args) => {
    assertAdminSecret(args.adminSecret);

    const caseDoc = await ctx.db.get(args.caseId);
    if (!caseDoc) return null;

    const route = getRouteByKey(caseDoc.routeKey);
    const profile = await ctx.db
      .query('moveProfiles')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .order('desc')
      .first();

    const checkReport = await ctx.db
      .query('reports')
      .withIndex('by_case_type', (q) => q.eq('caseId', args.caseId).eq('type', 'check'))
      .order('desc')
      .first();

    const livingReport = await ctx.db
      .query('reports')
      .withIndex('by_case_type', (q) => q.eq('caseId', args.caseId).eq('type', 'living'))
      .order('desc')
      .first();

    const livingSections = livingReport
      ? (
          await ctx.db
            .query('reportSections')
            .withIndex('by_report', (q) => q.eq('reportId', livingReport._id))
            .collect()
        ).sort((a, b) => a.sortOrder - b.sortOrder)
      : [];

    const checkSections = checkReport
      ? (
          await ctx.db
            .query('reportSections')
            .withIndex('by_report', (q) => q.eq('reportId', checkReport._id))
            .collect()
        ).sort((a, b) => a.sortOrder - b.sortOrder)
      : [];

    const packages = await ctx.db
      .query('packageRecommendations')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .collect();

    const jobs = await ctx.db
      .query('generationJobs')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .order('desc')
      .take(20);

    const notes = await ctx.db
      .query('adminNotes')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .order('desc')
      .collect();

    const auditEvents = await ctx.db
      .query('auditEvents')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .order('desc')
      .take(30);

    return {
      case: caseDoc,
      route,
      profile,
      checkReport,
      checkSections,
      livingReport,
      livingSections,
      packages,
      jobs,
      notes,
      auditEvents,
    };
  },
});

export const updateLivingSection = mutation({
  args: {
    ...adminSecretArg,
    sectionId: v.id('reportSections'),
    contentMarkdown: v.string(),
    title: v.optional(v.string()),
    riskLevel: v.optional(
      v.union(
        v.literal('low'),
        v.literal('medium'),
        v.literal('high'),
        v.literal('critical'),
        v.literal('unknown'),
      ),
    ),
    sectionStatus: v.optional(
      v.union(v.literal('generated'), v.literal('needs_review'), v.literal('published')),
    ),
  },
  handler: async (ctx, args) => {
    assertAdminSecret(args.adminSecret);

    const section = await ctx.db.get(args.sectionId);
    if (!section) throw new Error('Section not found');

    const now = Date.now();
    await ctx.db.patch(args.sectionId, {
      contentMarkdown: args.contentMarkdown,
      ...(args.title ? { title: args.title } : {}),
      ...(args.riskLevel ? { riskLevel: args.riskLevel } : {}),
      ...(args.sectionStatus ? { status: args.sectionStatus } : {}),
      updatedAt: now,
    });

    const report = await ctx.db.get(section.reportId);
    if (report && report.status === 'published') {
      await ctx.db.patch(report._id, { status: 'needs_review', updatedAt: now });
      await ctx.db.patch(section.caseId, {
        status: 'living_needs_review',
        reportStatus: 'living_needs_review',
        updatedAt: now,
      });
    }

    await ctx.db.insert('auditEvents', {
      caseId: section.caseId,
      eventType: 'admin_section_edited',
      payload: { sectionKey: section.sectionKey, reportId: section.reportId },
      createdAt: now,
    });

    return { status: 'saved' as const };
  },
});

export const publishLivingReport = mutation({
  args: {
    ...adminSecretArg,
    caseId: v.id('cases'),
    reportId: v.id('reports'),
  },
  handler: async (ctx, args) => {
    assertAdminSecret(args.adminSecret);

    const report = await ctx.db.get(args.reportId);
    if (!report || report.caseId !== args.caseId || report.type !== 'living') {
      throw new Error('Living report not found');
    }

    const now = Date.now();
    const sections = await ctx.db
      .query('reportSections')
      .withIndex('by_report', (q) => q.eq('reportId', args.reportId))
      .collect();

    for (const section of sections) {
      await ctx.db.patch(section._id, { status: 'published', updatedAt: now });
    }

    await ctx.db.patch(args.reportId, { status: 'published', updatedAt: now });
    await ctx.db.patch(args.caseId, {
      status: 'living_published',
      reportStatus: 'living_published',
      updatedAt: now,
    });

    await ctx.db.insert('auditEvents', {
      caseId: args.caseId,
      eventType: 'living_report_published',
      payload: { reportId: args.reportId, sectionCount: sections.length },
      createdAt: now,
    });

    return { status: 'published' as const, sectionCount: sections.length };
  },
});

export const addAdminNote = mutation({
  args: {
    ...adminSecretArg,
    caseId: v.id('cases'),
    body: v.string(),
    reportId: v.optional(v.id('reports')),
    author: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    assertAdminSecret(args.adminSecret);
    const body = args.body.trim();
    if (!body) throw new Error('Note cannot be empty');

    const now = Date.now();
    const noteId = await ctx.db.insert('adminNotes', {
      caseId: args.caseId,
      reportId: args.reportId,
      author: args.author?.trim() || 'Admin',
      body,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert('auditEvents', {
      caseId: args.caseId,
      eventType: 'admin_note_added',
      payload: { noteId },
      createdAt: now,
    });

    return { noteId };
  },
});
