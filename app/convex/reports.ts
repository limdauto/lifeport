import { v } from 'convex/values';
import { internalMutation, query } from './_generated/server';
import { PACKAGE_CATALOG } from './lib/packageCatalog';
import { affectedSectionsForChanges, changeSummaryForSections } from './lib/sectionDependencies';
import { getRouteByKey, type PackageKey } from './lib/routeConfigs';
import {
  caseStatusAfterLivingGeneration,
  founderReviewEnabled,
  livingReportStatusAfterGeneration,
} from './lib/reviewMode';

export const getCheck = query({
  args: { caseId: v.id('cases') },
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get(args.caseId);
    if (!caseDoc) return null;

    const report = await ctx.db
      .query('reports')
      .withIndex('by_case_type', (q) => q.eq('caseId', args.caseId).eq('type', 'check'))
      .order('desc')
      .first();

    if (!report) return null;

    const sections = await ctx.db
      .query('reportSections')
      .withIndex('by_report', (q) => q.eq('reportId', report._id))
      .collect();

    sections.sort((a, b) => a.sortOrder - b.sortOrder);

    const packages = await ctx.db
      .query('packageRecommendations')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .collect();

    const route = getRouteByKey(caseDoc.routeKey);

    const latestJob = await ctx.db
      .query('generationJobs')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .order('desc')
      .first();

    return {
      case: caseDoc,
      report,
      sections,
      packages,
      route,
      latestJob,
    };
  },
});

export const getReportSections = query({
  args: { reportId: v.id('reports') },
  handler: async (ctx, args) => {
    const sections = await ctx.db
      .query('reportSections')
      .withIndex('by_report', (q) => q.eq('reportId', args.reportId))
      .collect();
    return sections.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const getLivingReport = query({
  args: { caseId: v.id('cases') },
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get(args.caseId);
    if (!caseDoc) return null;

    const profile = await ctx.db
      .query('moveProfiles')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .order('desc')
      .first();

    const route = getRouteByKey(caseDoc.routeKey);

    const report = await ctx.db
      .query('reports')
      .withIndex('by_case_type', (q) => q.eq('caseId', args.caseId).eq('type', 'living'))
      .order('desc')
      .first();

    const sections = report
      ? (
          await ctx.db
            .query('reportSections')
            .withIndex('by_report', (q) => q.eq('reportId', report._id))
            .collect()
        ).sort((a, b) => a.sortOrder - b.sortOrder)
      : [];

    const packagesRaw = await ctx.db
      .query('packageRecommendations')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .collect();

    const packages = packagesRaw.map((pkg) => ({
      ...pkg,
      outcome: PACKAGE_CATALOG[pkg.packageKey as PackageKey]?.outcome,
    }));

    const versions = report
      ? (
          await ctx.db
            .query('reportVersions')
            .withIndex('by_report', (q) => q.eq('reportId', report._id))
            .order('desc')
            .collect()
        ).slice(0, 10)
      : [];

    const latestJob = await ctx.db
      .query('generationJobs')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .order('desc')
      .first();

    const pendingAffected = profile?.pendingAffectedSections as string[] | undefined;
    const awaitingReview =
      report?.status === 'needs_review' ||
      caseDoc.status === 'living_needs_review';
    const customerSections = awaitingReview ? [] : sections;

    return {
      case: caseDoc,
      profile,
      route,
      report,
      sections: customerSections,
      packages: awaitingReview ? [] : packages,
      versions: awaitingReview ? [] : versions,
      latestJob,
      pendingAffectedSections: pendingAffected ?? [],
      awaitingReview,
      founderReviewEnabled: founderReviewEnabled(),
    };
  },
});

export const getAffectedSectionsPreview = query({
  args: {
    caseId: v.id('cases'),
    changes: v.any(),
  },
  handler: async (ctx, args) => {
    const caseDoc = await ctx.db.get(args.caseId);
    if (!caseDoc) return { sections: [] as string[] };

    const route = getRouteByKey(caseDoc.routeKey);
    if (!route) return { sections: [] as string[] };

    const available = [...route.reportSections, 'expert_questions', 'change_log'];
    const sections = affectedSectionsForChanges(args.changes as Record<string, unknown>, available);
    return {
      sections,
      changeSummary: changeSummaryForSections(sections),
    };
  },
});

export const clearCheckArtifacts = internalMutation({
  args: {
    caseId: v.id('cases'),
    reportId: v.id('reports'),
  },
  handler: async (ctx, args) => {
    const sections = await ctx.db
      .query('reportSections')
      .withIndex('by_report', (q) => q.eq('reportId', args.reportId))
      .collect();
    for (const section of sections) {
      await ctx.db.delete(section._id);
    }

    const packages = await ctx.db
      .query('packageRecommendations')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .collect();
    for (const pkg of packages) {
      await ctx.db.delete(pkg._id);
    }
  },
});

const checkSectionValidator = v.object({
  sectionKey: v.string(),
  title: v.string(),
  contentMarkdown: v.string(),
  riskLevel: v.optional(
    v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high'),
      v.literal('critical'),
      v.literal('unknown'),
    ),
  ),
  status: v.union(v.literal('generated'), v.literal('locked')),
  sortOrder: v.number(),
  isPremiumLocked: v.optional(v.boolean()),
});

export const appendCheckSection = internalMutation({
  args: {
    caseId: v.id('cases'),
    reportId: v.id('reports'),
    section: checkSectionValidator,
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.insert('reportSections', {
      caseId: args.caseId,
      reportId: args.reportId,
      sectionKey: args.section.sectionKey,
      title: args.section.title,
      contentMarkdown: args.section.contentMarkdown,
      riskLevel: args.section.riskLevel,
      status: args.section.status === 'locked' ? 'locked' : 'generated',
      sortOrder: args.section.sortOrder,
      isPremiumLocked: args.section.isPremiumLocked,
      updatedAt: now,
    });
    await ctx.db.patch(args.reportId, { updatedAt: now });
  },
});

export const finalizeCheckReport = internalMutation({
  args: {
    caseId: v.id('cases'),
    reportId: v.id('reports'),
    summary: v.string(),
    packageRecommendations: v.array(
      v.object({
        packageKey: v.string(),
        title: v.string(),
        reason: v.string(),
        priceFrom: v.number(),
      }),
    ),
    jobId: v.id('generationJobs'),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    for (const pkg of args.packageRecommendations) {
      await ctx.db.insert('packageRecommendations', {
        caseId: args.caseId,
        packageKey: pkg.packageKey,
        title: pkg.title,
        reason: pkg.reason,
        status: 'recommended',
        priceFrom: pkg.priceFrom,
        createdAt: now,
        updatedAt: now,
      });
    }

    await ctx.db.patch(args.reportId, {
      status: 'ready',
      summary: args.summary,
      updatedAt: now,
    });

    await ctx.db.patch(args.caseId, {
      status: 'check_ready',
      reportStatus: 'check_ready',
      updatedAt: now,
    });

    await ctx.db.patch(args.jobId, {
      status: 'succeeded',
      updatedAt: now,
    });

    await ctx.db.insert('auditEvents', {
      caseId: args.caseId,
      eventType: 'check_generated',
      payload: { reportId: args.reportId },
      createdAt: now,
    });
  },
});

export const writeCheckSections = internalMutation({
  args: {
    caseId: v.id('cases'),
    reportId: v.id('reports'),
    sections: v.array(
      v.object({
        sectionKey: v.string(),
        title: v.string(),
        contentMarkdown: v.string(),
        riskLevel: v.optional(
          v.union(
            v.literal('low'),
            v.literal('medium'),
            v.literal('high'),
            v.literal('critical'),
            v.literal('unknown'),
          ),
        ),
        status: v.union(v.literal('generated'), v.literal('locked')),
        sortOrder: v.number(),
        isPremiumLocked: v.optional(v.boolean()),
      }),
    ),
    summary: v.string(),
    packageRecommendations: v.array(
      v.object({
        packageKey: v.string(),
        title: v.string(),
        reason: v.string(),
        priceFrom: v.number(),
      }),
    ),
    jobId: v.id('generationJobs'),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    for (const section of args.sections) {
      await ctx.db.insert('reportSections', {
        caseId: args.caseId,
        reportId: args.reportId,
        sectionKey: section.sectionKey,
        title: section.title,
        contentMarkdown: section.contentMarkdown,
        riskLevel: section.riskLevel,
        status: section.status === 'locked' ? 'locked' : 'generated',
        sortOrder: section.sortOrder,
        isPremiumLocked: section.isPremiumLocked,
        updatedAt: now,
      });
    }

    for (const pkg of args.packageRecommendations) {
      await ctx.db.insert('packageRecommendations', {
        caseId: args.caseId,
        packageKey: pkg.packageKey,
        title: pkg.title,
        reason: pkg.reason,
        status: 'recommended',
        priceFrom: pkg.priceFrom,
        createdAt: now,
        updatedAt: now,
      });
    }

    await ctx.db.patch(args.reportId, {
      status: 'ready',
      summary: args.summary,
      updatedAt: now,
    });

    await ctx.db.patch(args.caseId, {
      status: 'check_ready',
      reportStatus: 'check_ready',
      updatedAt: now,
    });

    await ctx.db.patch(args.jobId, {
      status: 'succeeded',
      updatedAt: now,
    });

    await ctx.db.insert('auditEvents', {
      caseId: args.caseId,
      eventType: 'check_generated',
      payload: { reportId: args.reportId },
      createdAt: now,
    });
  },
});

const livingSectionValidator = checkSectionValidator;

export const appendLivingSection = internalMutation({
  args: {
    caseId: v.id('cases'),
    reportId: v.id('reports'),
    section: livingSectionValidator,
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.insert('reportSections', {
      caseId: args.caseId,
      reportId: args.reportId,
      sectionKey: args.section.sectionKey,
      title: args.section.title,
      contentMarkdown: args.section.contentMarkdown,
      riskLevel: args.section.riskLevel,
      status: 'generated',
      sortOrder: args.section.sortOrder,
      isPremiumLocked: args.section.isPremiumLocked,
      updatedAt: now,
    });
    await ctx.db.patch(args.reportId, { updatedAt: now });
  },
});

export const replaceLivingSections = internalMutation({
  args: {
    caseId: v.id('cases'),
    reportId: v.id('reports'),
    sections: v.array(livingSectionValidator),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    for (const section of args.sections) {
      const existing = await ctx.db
        .query('reportSections')
        .withIndex('by_report_section', (q) =>
          q.eq('reportId', args.reportId).eq('sectionKey', section.sectionKey),
        )
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          title: section.title,
          contentMarkdown: section.contentMarkdown,
          riskLevel: section.riskLevel,
          status: 'generated',
          sortOrder: section.sortOrder,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert('reportSections', {
          caseId: args.caseId,
          reportId: args.reportId,
          sectionKey: section.sectionKey,
          title: section.title,
          contentMarkdown: section.contentMarkdown,
          riskLevel: section.riskLevel,
          status: 'generated',
          sortOrder: section.sortOrder,
          updatedAt: now,
        });
      }
    }
    await ctx.db.patch(args.reportId, { updatedAt: now });
  },
});

export const finalizeLivingReport = internalMutation({
  args: {
    caseId: v.id('cases'),
    reportId: v.id('reports'),
    summary: v.string(),
    packageRecommendations: v.array(
      v.object({
        packageKey: v.string(),
        title: v.string(),
        reason: v.string(),
        priceFrom: v.number(),
      }),
    ),
    jobId: v.id('generationJobs'),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const existingPackages = await ctx.db
      .query('packageRecommendations')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .collect();
    const existingKeys = new Set(existingPackages.map((p) => p.packageKey));

    for (const pkg of args.packageRecommendations) {
      if (existingKeys.has(pkg.packageKey)) continue;
      await ctx.db.insert('packageRecommendations', {
        caseId: args.caseId,
        packageKey: pkg.packageKey,
        title: pkg.title,
        reason: pkg.reason,
        status: 'recommended',
        priceFrom: pkg.priceFrom,
        createdAt: now,
        updatedAt: now,
      });
    }

    const deliveryStatus = livingReportStatusAfterGeneration();
    const caseStatus = caseStatusAfterLivingGeneration();

    await ctx.db.patch(args.reportId, {
      status: deliveryStatus,
      summary: args.summary,
      updatedAt: now,
    });

    await ctx.db.patch(args.caseId, {
      status: caseStatus,
      reportStatus: caseStatus,
      updatedAt: now,
    });

    const profile = await ctx.db
      .query('moveProfiles')
      .withIndex('by_case', (q) => q.eq('caseId', args.caseId))
      .order('desc')
      .first();
    if (profile) {
      await ctx.db.patch(profile._id, {
        pendingAffectedSections: [],
        pendingChangeSummary: undefined,
        updatedAt: now,
      });
    }

    await ctx.db.patch(args.jobId, { status: 'succeeded', updatedAt: now });

    await ctx.db.insert('auditEvents', {
      caseId: args.caseId,
      eventType: 'living_generated',
      payload: { reportId: args.reportId },
      createdAt: now,
    });
  },
});

export const snapshotReportVersion = internalMutation({
  args: {
    caseId: v.id('cases'),
    reportId: v.id('reports'),
    changeSummary: v.string(),
    sectionKeys: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.reportId);
    if (!report) return;

    const sections = await ctx.db
      .query('reportSections')
      .withIndex('by_report', (q) => q.eq('reportId', args.reportId))
      .collect();

    const snapshot = sections
      .filter((s) => args.sectionKeys.includes(s.sectionKey))
      .map((s) => ({
        sectionKey: s.sectionKey,
        title: s.title,
        contentMarkdown: s.contentMarkdown,
        riskLevel: s.riskLevel,
      }));

    await ctx.db.insert('reportVersions', {
      caseId: args.caseId,
      reportId: args.reportId,
      version: report.version,
      changeSummary: args.changeSummary,
      sectionSnapshots: snapshot,
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.reportId, {
      version: report.version + 1,
      updatedAt: Date.now(),
    });
  },
});

export const appendChangeLogEntry = internalMutation({
  args: {
    reportId: v.id('reports'),
    caseId: v.id('cases'),
    entry: v.string(),
  },
  handler: async (ctx, args) => {
    const logSection = await ctx.db
      .query('reportSections')
      .withIndex('by_report_section', (q) =>
        q.eq('reportId', args.reportId).eq('sectionKey', 'change_log'),
      )
      .first();

    const now = Date.now();
    const stamp = new Date(now).toISOString().slice(0, 16).replace('T', ' ');
    const line = `- **${stamp}** — ${args.entry}`;

    if (logSection) {
      const body = logSection.contentMarkdown.includes('No changes yet')
        ? line
        : `${logSection.contentMarkdown}\n${line}`;
      await ctx.db.patch(logSection._id, { contentMarkdown: body, updatedAt: now });
    } else {
      await ctx.db.insert('reportSections', {
        caseId: args.caseId,
        reportId: args.reportId,
        sectionKey: 'change_log',
        title: 'Change Log',
        contentMarkdown: line,
        status: 'generated',
        sortOrder: 99,
        updatedAt: now,
      });
    }
  },
});

export const markJobFailed = internalMutation({
  args: {
    jobId: v.id('generationJobs'),
    caseId: v.id('cases'),
    reportId: v.id('reports'),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.jobId, { status: 'failed', error: args.error, updatedAt: now });
    await ctx.db.patch(args.reportId, { status: 'failed', updatedAt: now });
    await ctx.db.insert('auditEvents', {
      caseId: args.caseId,
      eventType: 'check_generation_failed',
      payload: { error: args.error },
      createdAt: now,
    });
  },
});
