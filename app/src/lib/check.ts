/** Mirrors convex/lib/checkGenerator section order for progressive UI. */
export const CHECK_SECTION_COUNT = 6;

export const CHECK_SECTION_PLACEHOLDERS = [
  { sectionKey: 'move_summary', title: 'Your move' },
  { sectionKey: 'top_findings', title: 'What Lifeport found' },
  { sectionKey: 'hidden_dependencies', title: 'Hidden dependencies' },
  { sectionKey: 'likely_friction_areas', title: 'Likely friction areas' },
  { sectionKey: 'recommended_next_step', title: 'Recommended next step' },
  { sectionKey: 'premium_preview', title: 'Unlock Lifeport Plan' },
] as const;

export function checkProgressMessage(
  step: number,
  ctx: { name: string; origin: string; destination: string; routeTitle?: string },
): string {
  const messages = [
    `Reviewing ${ctx.name}'s move from ${ctx.origin} to ${ctx.destination}…`,
    `Mapping ${ctx.routeTitle ?? ctx.destination} dependencies…`,
    'Tracing banking, housing, and visa links…',
    'Identifying likely friction areas…',
    'Drafting your personalised findings…',
    'Finalising your Lifeport Check…',
  ];
  return messages[Math.min(step, messages.length - 1)] ?? messages[messages.length - 1];
}
