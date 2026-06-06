import { generateCheckSections, type CheckAnswers } from '../../../convex/lib/checkGenerator';
import type { LivingAnswers } from '../../../convex/lib/livingGenerator';
import { generateLivingSections } from '../../../convex/lib/livingGenerator';
import { PACKAGE_CATALOG } from '../../../convex/lib/packageCatalog';
import { packageReasonForRoute } from '../../../convex/lib/routeKnowledge';
import { getRouteByKey, type RouteKey } from '@/lib/routes';
import { DEBUG_ANSWERS } from '@/lib/debug/answers';
import type { Id } from 'convex/_generated/dataModel';

export const DEBUG_CASE_ID = 'debug000000000000000000000000' as Id<'cases'>;

export function isDebugCaseId(caseId: string): boolean {
  return caseId === DEBUG_CASE_ID;
}

export function buildDebugCheckPayload(routeKey: RouteKey) {
  const route = getRouteByKey(routeKey);
  if (!route) return null;

  const answers = {
    routeKey,
    ...DEBUG_ANSWERS[routeKey],
  } as CheckAnswers;

  const generated = generateCheckSections(route, answers);
  const sections = generated.map((section, index) => ({
    _id: `debug-check-section-${index}`,
    ...section,
  }));

  const packages = route.packages.slice(0, 4).map((packageKey, index) => {
    const catalog = PACKAGE_CATALOG[packageKey];
    return {
      _id: `debug-check-pkg-${index}`,
      packageKey,
      title: catalog?.title ?? packageKey,
      reason: packageReasonForRoute(packageKey, route, answers),
      priceFrom: catalog?.priceFrom,
      status: index === 0 ? 'recommended' : 'recommended',
    };
  });

  return {
    case: {
      _id: DEBUG_CASE_ID,
      name: answers.name,
      originCountry: answers.originCountry,
      destinationCountry: answers.destinationCountry,
      paymentStatus: 'unpaid' as const,
      routeKey,
    },
    route,
    report: {
      _id: 'debug-check-report',
      title: `Lifeport Check — ${route.title}`,
      status: 'ready' as const,
      summary: 'Debug preview with stubbed intake answers.',
    },
    sections,
    packages,
    latestJob: null,
  };
}

export function buildDebugLivingPayload(routeKey: RouteKey) {
  const route = getRouteByKey(routeKey);
  if (!route) return null;

  const answers = {
    routeKey,
    ...DEBUG_ANSWERS[routeKey],
  } as LivingAnswers;

  const generated = generateLivingSections(route, answers);
  const sections = generated.map((section, index) => ({
    _id: `debug-living-section-${index}`,
    ...section,
  }));

  const packages = route.packages.slice(0, 6).map((packageKey, index) => {
    const catalog = PACKAGE_CATALOG[packageKey];
    return {
      _id: `debug-living-pkg-${index}`,
      packageKey,
      title: catalog?.title ?? packageKey,
      reason: packageReasonForRoute(packageKey, route, answers),
      outcome: catalog?.outcome,
      priceFrom: catalog?.priceFrom,
      status: index === 1 ? 'requested' : 'recommended',
    };
  });

  return {
    case: {
      _id: DEBUG_CASE_ID,
      name: answers.name,
      paymentStatus: 'paid' as const,
      routeKey,
      status: 'living_report_ready' as const,
    },
    route,
    report: {
      _id: 'debug-living-report',
      title: `Lifeport Plan — ${route.title}`,
      status: 'published' as const,
      summary: 'Debug preview — stubbed profile and generated sections.',
    },
    sections,
    packages,
    versions: [
      {
        changeSummary: 'Initial Lifeport Plan generated from debug fixture',
        createdAt: Date.now() - 86_400_000,
      },
    ],
    latestJob: null,
    profile: {
      version: 1,
      rawAnswers: { ...answers } as Record<string, string>,
      pendingChangeSummary: undefined,
    },
    awaitingReview: false,
    pendingAffectedSections: [] as string[],
  };
}
