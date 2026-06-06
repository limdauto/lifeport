import type { RouteConfig } from './routeConfigs';
import { recommendedPackagesSection, routeSectionDraft } from './routeKnowledge';
import { sectionTitle } from './sectionTitles';
import type { CheckAnswers } from './checkGenerator';

export type LivingAnswers = CheckAnswers & Record<string, string | undefined>;

export type GeneratedLivingSection = {
  sectionKey: string;
  title: string;
  contentMarkdown: string;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical' | 'unknown';
  status: 'generated' | 'locked';
  sortOrder: number;
};

export const LIVING_SECTION_DELAY_MS = 1800;

function statusVal(answers: LivingAnswers, key: string, fallbackKey?: string): string {
  return answers[key] ?? (fallbackKey ? answers[fallbackKey] : undefined) ?? 'not_started';
}

function riskFromStatuses(answers: LivingAnswers): 'low' | 'medium' | 'high' {
  const uncertain = [
    statusVal(answers, 'visaStatus', 'primaryApplicantVisaStatus'),
    statusVal(answers, 'housingStatus', 'accommodationStatus'),
    answers.bankingStatus,
  ].filter((s) => s === 'uncertain' || s === 'not_started').length;
  if (uncertain >= 2) return 'high';
  if (uncertain === 1) return 'medium';
  return 'low';
}

export function livingSectionOrder(route: RouteConfig): string[] {
  return [...route.reportSections];
}

function sectionContent(
  key: string,
  route: RouteConfig,
  answers: LivingAnswers,
): { contentMarkdown: string; riskLevel?: GeneratedLivingSection['riskLevel'] } {
  const baseRisk = riskFromStatuses(answers);
  const routeDraft = routeSectionDraft(route.routeKey, key, { route, answers, baseRisk });
  if (routeDraft) return routeDraft;

  const moveLine = `**${answers.name}** · ${answers.originCountry} → ${answers.destinationCountry}${
    answers.moveDate ? ` · target **${answers.moveDate}**` : ''
  } · **${answers.householdType}**`;

  switch (key) {
    case 'hidden_dependencies': {
      const draft = routeSectionDraft(route.routeKey, 'hidden_dependencies', {
        route,
        answers,
        baseRisk,
      });
      return (
        draft ?? {
          riskLevel: 'high',
          contentMarkdown: `Dependency map for **${route.title}** — add detail in Inputs to sharpen sequencing.`,
        }
      );
    }
    case 'recommended_packages':
      return recommendedPackagesSection(route, answers);
    case 'executive_brief':
      return {
        riskLevel: baseRisk,
        contentMarkdown: `${moveLine}\n\n**Primary concern:** ${answers.biggestWorry}\n\n**Route:** ${route.title}\n\nThis Living Report maps dependencies across visa, money, housing, tax, and family setup. Sections below update when your move profile changes.`,
      };
    case 'move_profile':
      return {
        contentMarkdown: `${moveLine}\n\n| Area | Status |\n|------|--------|\n| Visa | ${answers.visaStatus} |\n| Housing | ${answers.housingStatus} |\n| Banking | ${answers.bankingStatus} |\n\n**Dependants:** ${answers.dependants ?? 'None noted'}\n\n**Top concerns:** ${answers.topConcerns ?? answers.biggestWorry}`,
      };
    case 'risk_map':
      return {
        riskLevel: baseRisk === 'high' ? 'high' : 'medium',
        contentMarkdown: route.painPoints.map((p, i) => `${i + 1}. **${p}**`).join('\n') +
          `\n\n*Risk levels reflect your current visa (${answers.visaStatus}), housing (${answers.housingStatus}), and banking (${answers.bankingStatus}) status.*`,
      };
    case 'timeline':
      return {
        riskLevel: answers.moveDate ? 'medium' : 'high',
        contentMarkdown: answers.moveDate
          ? `**Target move:** ${answers.moveDate}\n\n**Suggested sequence:**\n1. Confirm visa route and document pack\n2. Open banking pathway (often blocks housing)\n3. Secure interim address evidence\n4. Register healthcare\n5. First-90-days setup sprint\n\n*Timeline recalculates when your move date changes.*`
          : `**Move date not set** — timeline cannot be sequenced reliably. Add a target date in Inputs to unlock a dated critical path.`,
      };
    case 'visa_admin':
      return {
        riskLevel: answers.visaStatus === 'uncertain' ? 'high' : 'medium',
        contentMarkdown: `**Visa status:** ${answers.visaStatus}\n\nFor **${route.title}**, admin tasks typically include credential collection, address registration, and right-to-work/residence evidence.\n\n${answers.visaStatus === 'not_started' ? '⚠️ Visa route not started — treat as blocking dependency for banking and housing.' : 'Continue gathering route-specific document checklist in Expert Questions.'}`,
      };
    case 'tax_residence':
      return {
        riskLevel: 'medium',
        contentMarkdown: `**Origin:** ${answers.originCountry} · **Destination:** ${answers.destinationCountry}\n\nTax residence timing interacts with your move date and asset profile. For ${route.title}, review split-year treatment, remittance basis (if applicable), and exit/entry reporting windows.\n\n${answers.taxResidencyHistory ? `**History noted:** ${answers.taxResidencyHistory}` : ''}`,
      };
    case 'banking_money':
      return {
        riskLevel: answers.bankingStatus === 'not_started' ? 'high' : 'medium',
        contentMarkdown: `**Banking status:** ${answers.bankingStatus}\n\nLocal account setup often gates housing, payroll, and utility contracts. Plan proof-of-address alternatives and international transfer cutover.\n\n${answers.bankingStatus === 'not_started' ? '**Priority:** Start banking pathway this week — likely on your critical path.' : 'Maintain KYC document pack ready for in-country activation.'}`,
      };
    case 'housing':
      return {
        riskLevel: answers.housingStatus === 'not_started' ? 'high' : 'medium',
        contentMarkdown: `**Housing status:** ${answers.housingStatus}\n\nSequence housing search against banking readiness and school catchments (if applicable). Interim accommodation may be required while accounts and references are established.`,
      };
    case 'healthcare':
      return {
        riskLevel: 'medium',
        contentMarkdown: `Register healthcare early after arrival. For **${answers.householdType}** households, dependant coverage and GP allocation should be sequenced with address evidence.`,
      };
    case 'family':
      return {
        riskLevel: answers.householdType === 'family' ? 'medium' : 'low',
        contentMarkdown: answers.dependants
          ? `**Dependants:** ${answers.dependants}\n\n${answers.childrenAges ? `**Children:** ${answers.childrenAges}\n\n` : ''}Coordinate spouse/child visas, school/nursery timing, and family banking.\n\n${answers.schoolPreferences ? `**School preferences:** ${answers.schoolPreferences}` : ''}`
          : `Household type: **${answers.householdType}**. Family-specific sections activate when dependant details are added in Inputs.`,
      };
    case 'property_pension_investments':
      return {
        riskLevel: 'medium',
        contentMarkdown: `Cross-border assets need continuity planning.\n\n${answers.assetsPropertyPension ? `**Assets noted:** ${answers.assetsPropertyPension}\n\n` : ''}${answers.pensions ? `**Pensions:** ${answers.pensions}\n\n` : ''}${answers.propertyUk ? `**UK property:** ${answers.propertyUk}` : 'Add asset detail in Inputs for pension/property-specific guidance.'}`,
      };
    case 'estate_wills':
      return {
        riskLevel: 'low',
        contentMarkdown: `Review wills, powers of attorney, and beneficiary designations when residency changes. Especially relevant for **${answers.householdType}** moves with dependants.`,
      };
    case 'first_90_days':
      return {
        riskLevel: 'medium',
        contentMarkdown: `**Arrival sprint checklist for ${route.title}:**\n\n- Banking activation & card delivery\n- Interim address → utility setup\n- GP / healthcare registration\n- Tax/admin registrations\n- School or nursery enquiries (if applicable)\n\n${answers.moveDate ? `Anchor to move date **${answers.moveDate}**.` : 'Set a move date to generate a dated 90-day plan.'}`,
      };
    case 'expert_questions':
      return {
        contentMarkdown: `**Questions to validate with a specialist:**\n\n1. Is my visa route still optimal given ${answers.visaStatus} status?\n2. What is my tax residence trigger date for this move?\n3. Which banking pathway works without a local lease yet?\n4. What documents should I prepare before departure?\n5. Are there route-specific restrictions for ${answers.householdType} households?`,
      };
    case 'change_log':
      return {
        contentMarkdown: `_No changes yet. When you update Inputs, affected sections regenerate and entries appear here._`,
      };
    default:
      return {
        contentMarkdown: `Analysis for **${sectionTitle(key)}** on the **${route.title}** route. Add detail in Inputs to sharpen this section.`,
        riskLevel: 'unknown',
      };
  }
}

export function generateLivingSections(
  route: RouteConfig,
  answers: LivingAnswers,
  onlyKeys?: string[],
): GeneratedLivingSection[] {
  const order = livingSectionOrder(route);
  const keys = onlyKeys ?? order;
  return keys.map((key) => {
    const { contentMarkdown, riskLevel } = sectionContent(key, route, answers);
    const sortOrder = order.indexOf(key) + 1;
    return {
      sectionKey: key,
      title: sectionTitle(key),
      contentMarkdown,
      riskLevel,
      status: 'generated',
      sortOrder: sortOrder > 0 ? sortOrder : order.length,
    };
  });
}
