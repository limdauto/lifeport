import type { RouteConfig } from './routeConfigs';
import { checkHiddenDependencies } from './routeKnowledge';

/** Sections streamed in order during first-check generation. */
export const CHECK_SECTION_COUNT = 6;

/** Pause before each section is written — makes the stub feel deliberate. */
export const CHECK_SECTION_DELAYS_MS = [2500, 3000, 2800, 3000, 2800, 2600] as const;

/**
 * Template-based Lifeport Check generation (not LLM yet).
 * Personalises with intake answers + route config; swap for LLM when OPENAI_API_KEY is wired.
 */

export type CheckAnswers = {
  email: string;
  name: string;
  routeKey: string;
  originCountry: string;
  destinationCountry: string;
  moveDate?: string;
  householdType: string;
  topConcerns?: string;
  visaStatus: string;
  housingStatus: string;
  bankingStatus: string;
  dependants?: string;
  biggestWorry: string;
  [key: string]: string | undefined;
};

export type GeneratedSection = {
  sectionKey: string;
  title: string;
  contentMarkdown: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
  status: 'generated' | 'locked';
  sortOrder: number;
  isPremiumLocked?: boolean;
};

function frictionForRoute(route: RouteConfig, answers: CheckAnswers): string[] {
  const base = [...route.painPoints];
  if (answers.bankingStatus === 'not_started') base.unshift('Banking not started — likely blocks housing');
  if (answers.housingStatus === 'not_started') base.push('Housing search not started');
  if (answers.visaStatus === 'uncertain') base.push('Visa route still uncertain');
  return base.slice(0, 5);
}

export function generateCheckSections(route: RouteConfig, answers: CheckAnswers): GeneratedSection[] {
  const findings = frictionForRoute(route, answers);
  const moveSummary = `**${answers.name}** is planning a move from **${answers.originCountry}** to **${answers.destinationCountry}**${
    answers.moveDate ? ` around **${answers.moveDate}**` : ''
  }, travelling as **${answers.householdType}**.`;

  const frictionAreas = route.checks
    .slice(0, 8)
    .map((a) => `- ${a}`)
    .join('\n');

  const hiddenDeps = checkHiddenDependencies(route, answers as CheckAnswers & Record<string, string>);

  const premiumSections = route.reportSections
    .filter((s) => !['move_profile', 'risk_map', 'timeline'].includes(s))
    .map((s) => s.replace(/_/g, ' '))
    .join(', ');

  return [
    {
      sectionKey: 'move_summary',
      title: 'Your move',
      contentMarkdown: `${moveSummary}\n\n**Top concern:** ${answers.topConcerns || answers.biggestWorry}\n\n**Visa:** ${answers.visaStatus} · **Housing:** ${answers.housingStatus} · **Banking:** ${answers.bankingStatus}`,
      riskLevel: 'unknown',
      status: 'generated',
      sortOrder: 1,
    },
    {
      sectionKey: 'top_findings',
      title: 'What Lifeport found',
      contentMarkdown: findings.map((f, i) => `${i + 1}. ${f}`).join('\n'),
      riskLevel: 'high',
      status: 'generated',
      sortOrder: 2,
    },
    {
      sectionKey: 'hidden_dependencies',
      title: 'Hidden dependencies',
      contentMarkdown: `${hiddenDeps}\n\n*Full dependency map in your Living Report.*`,
      riskLevel: answers.visaStatus === 'uncertain' ? 'high' : 'medium',
      status: 'generated',
      sortOrder: 3,
    },
    {
      sectionKey: 'likely_friction_areas',
      title: 'Likely friction areas',
      contentMarkdown: `Based on your **${route.title}** route, these areas need attention:\n\n${frictionAreas}\n\n*Route-specific detail and sequencing in your Living Report.*`,
      riskLevel: 'medium',
      status: 'generated',
      sortOrder: 4,
    },
    {
      sectionKey: 'recommended_next_step',
      title: 'Recommended next step',
      contentMarkdown: `Your free Lifeport Check covers the first look. For a **private, updatable report** with timeline, risk flags, expert questions, and setup packages, unlock your **Living Report**.\n\n**From £${route.livingPriceGbp}** for this route.`,
      riskLevel: 'low',
      status: 'generated',
      sortOrder: 5,
    },
    {
      sectionKey: 'premium_preview',
      title: 'Unlock Living Report',
      contentMarkdown: `Your Living Report adds full analysis for: **${premiumSections}**, plus expert-review questions, package recommendations, and a change log that updates when your situation changes.\n\n**From £${route.livingPriceGbp}** for this route.`,
      status: 'locked',
      sortOrder: 6,
      isPremiumLocked: true,
    },
  ];
}
