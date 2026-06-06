export const PUBLIC_APP_URL =
  import.meta.env.PUBLIC_APP_URL ?? 'http://localhost:3000';

export const SNAPSHOT_CTA = 'Get my free Snapshot';
export const LIVING_CTA = 'Unlock Living Report';

export const PLAN_CTA = SNAPSHOT_CTA;
export const PLAN_CTA_HREF = `${PUBLIC_APP_URL}/uk-to-dubai/snapshot`;

export const PLAN_TAGLINE =
  'Start with a free Snapshot. Unlock the Living Report when you\'re ready to plan the move properly.';

export const PLAN_DELIVERY_NOTE =
  'Your Snapshot generates in seconds. Living Reports update reactively as your move profile changes.';

/** Maps marketing route slugs to product app slugs */
export const APP_ROUTE_SLUGS: Record<string, string> = {
  professionals: 'professionals-to-uk',
  'uk-to-dubai': 'uk-to-dubai',
  'families-uk': 'families-to-uk',
};

export function snapshotHref(marketingSlug: string): string {
  const appSlug = APP_ROUTE_SLUGS[marketingSlug] ?? marketingSlug;
  return `${PUBLIC_APP_URL}/${appSlug}/snapshot`;
}

export function routeHref(marketingSlug: string): string {
  const appSlug = APP_ROUTE_SLUGS[marketingSlug] ?? marketingSlug;
  return `${PUBLIC_APP_URL}/${appSlug}`;
}
