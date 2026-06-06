/** Living report section order mirrors convex/lib/livingGenerator. */
export const LIVING_CORE_SECTIONS = [
  'executive_brief',
  'move_profile',
  'risk_map',
  'timeline',
  'visa_admin',
  'tax_residence',
  'banking_money',
  'housing',
  'healthcare',
  'family',
  'property_pension_investments',
  'estate_wills',
  'first_90_days',
  'expert_questions',
  'change_log',
] as const;

export function livingProgressMessage(
  step: number,
  ctx: { name: string; routeTitle?: string },
): string {
  const messages = [
    `Drafting executive brief for ${ctx.name}…`,
    `Building move profile…`,
    `Mapping risks for ${ctx.routeTitle ?? 'your route'}…`,
    'Sequencing timeline and dependencies…',
    'Reviewing visa and admin path…',
    'Analysing tax and residence…',
    'Checking banking and housing links…',
    'Finalising remaining sections…',
  ];
  return messages[Math.min(step, messages.length - 1)] ?? messages[messages.length - 1];
}
