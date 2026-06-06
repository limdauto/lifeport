'use node';

import { v } from 'convex/values';
import { internalAction } from './_generated/server';
import { internal } from './_generated/api';
import { getRouteByKey } from './lib/routeConfigs';
import { PACKAGE_CATALOG } from './lib/packageCatalog';
import { packageReasonForRoute } from './lib/routeKnowledge';
import type { PackageKey } from './lib/routeConfigs';
import {
  CHECK_SECTION_DELAYS_MS,
  generateCheckSections,
  type CheckAnswers,
} from './lib/checkGenerator';
import {
  LIVING_SECTION_DELAY_MS,
  generateLivingSections,
  type LivingAnswers,
} from './lib/livingGenerator';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const generateCheck = internalAction({
  args: {
    caseId: v.id('cases'),
    reportId: v.id('reports'),
    jobId: v.id('generationJobs'),
  },
  handler: async (ctx, args) => {
    const caseDoc = await ctx.runQuery(internal.cases.getCaseInternal, {
      caseId: args.caseId,
    });
    if (!caseDoc) throw new Error('Case not found');

    const route = getRouteByKey(caseDoc.routeKey);
    if (!route) throw new Error('Route config not found');

    await ctx.runMutation(internal.cases.patchJobRunning, { jobId: args.jobId });
    await ctx.runMutation(internal.reports.clearCheckArtifacts, {
      caseId: args.caseId,
      reportId: args.reportId,
    });

    try {
      const answers = caseDoc.profile?.rawAnswers as CheckAnswers;
      const sections = generateCheckSections(route, answers);

      const summary = `A first look at the areas ${answers.name}'s move may affect — ${answers.originCountry} to ${answers.destinationCountry}.`;

      const packageRecommendations = route.packages
        .slice(0, 3)
        .map((key) => ({
          packageKey: key,
          title: PACKAGE_CATALOG[key as PackageKey]?.title ?? key,
          reason: packageReasonForRoute(key, route, answers as LivingAnswers),
          priceFrom: PACKAGE_CATALOG[key as PackageKey]?.priceFrom ?? 199,
        }));

      if (process.env.OPENAI_API_KEY) {
        // Future: call LLM with route section specs + answers.
      }

      for (let i = 0; i < sections.length; i++) {
        await sleep(CHECK_SECTION_DELAYS_MS[i] ?? 2800);
        await ctx.runMutation(internal.reports.appendCheckSection, {
          caseId: args.caseId,
          reportId: args.reportId,
          section: sections[i],
        });
      }

      await sleep(1500);

      await ctx.runMutation(internal.reports.finalizeCheckReport, {
        caseId: args.caseId,
        reportId: args.reportId,
        summary,
        packageRecommendations,
        jobId: args.jobId,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown generation error';
      await ctx.runMutation(internal.reports.markJobFailed, {
        jobId: args.jobId,
        caseId: args.caseId,
        reportId: args.reportId,
        error: message,
      });
    }
  },
});

export const generateLiving = internalAction({
  args: {
    caseId: v.id('cases'),
    reportId: v.id('reports'),
    jobId: v.id('generationJobs'),
    sectionKeys: v.optional(v.array(v.string())),
    changeSummary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const caseDoc = await ctx.runQuery(internal.cases.getCaseInternal, {
      caseId: args.caseId,
    });
    if (!caseDoc) throw new Error('Case not found');

    const route = getRouteByKey(caseDoc.routeKey);
    if (!route) throw new Error('Route config not found');

    await ctx.runMutation(internal.cases.patchJobRunning, { jobId: args.jobId });

    const isPartial = Boolean(args.sectionKeys?.length);

    try {
      const answers = caseDoc.profile?.rawAnswers as LivingAnswers;
      const keys = args.sectionKeys;
      const sections = generateLivingSections(route, answers, keys);

      if (isPartial && args.changeSummary) {
        await ctx.runMutation(internal.reports.snapshotReportVersion, {
          caseId: args.caseId,
          reportId: args.reportId,
          changeSummary: args.changeSummary,
          sectionKeys: keys!,
        });
        await ctx.runMutation(internal.reports.appendChangeLogEntry, {
          caseId: args.caseId,
          reportId: args.reportId,
          entry: args.changeSummary,
        });
      }

      const summary = `Living Report for ${answers.name} — ${route.title}. Updates when your move profile changes.`;

      const packageRecommendations = route.packages.map((key) => ({
        packageKey: key,
        title: PACKAGE_CATALOG[key as PackageKey]?.title ?? key,
        reason: packageReasonForRoute(key, route, answers),
        priceFrom: PACKAGE_CATALOG[key as PackageKey]?.priceFrom ?? 199,
      }));

      if (isPartial) {
        for (let i = 0; i < sections.length; i++) {
          await sleep(Math.max(600, LIVING_SECTION_DELAY_MS / 2));
          await ctx.runMutation(internal.reports.replaceLivingSections, {
            caseId: args.caseId,
            reportId: args.reportId,
            sections: [sections[i]],
          });
        }
        await ctx.runMutation(internal.reports.finalizeLivingReport, {
          caseId: args.caseId,
          reportId: args.reportId,
          summary,
          packageRecommendations: [],
          jobId: args.jobId,
        });
        return;
      }

      for (let i = 0; i < sections.length; i++) {
        await sleep(LIVING_SECTION_DELAY_MS);
        await ctx.runMutation(internal.reports.appendLivingSection, {
          caseId: args.caseId,
          reportId: args.reportId,
          section: sections[i],
        });
      }

      await sleep(1200);

      await ctx.runMutation(internal.reports.finalizeLivingReport, {
        caseId: args.caseId,
        reportId: args.reportId,
        summary,
        packageRecommendations,
        jobId: args.jobId,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown generation error';
      await ctx.runMutation(internal.reports.markJobFailed, {
        jobId: args.jobId,
        caseId: args.caseId,
        reportId: args.reportId,
        error: message,
      });
    }
  },
});
