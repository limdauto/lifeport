export const CHECK_CTA = 'Check my move';
export const CHECK_CTA_ALT = 'Get my free Lifeport Check';
export const LIVING_CTA = 'Unlock your Lifeport Plan';
export const PLAN_CTA = CHECK_CTA;
export const PLAN_CTA_HREF = '/check?route=uk-to-dubai';

export const HERO_HEADLINE = 'Port your life to a new country.';
export const HERO_SUBHEAD =
  'Lifeport checks the parts of your move people often miss — banking, housing, healthcare, tax, pets, documents, licences, storage, family setup, and your first 90 days.';

export const TAGLINE =
  "Start with a free Lifeport Check. Unlock your Lifeport Plan when you're ready to plan the move properly.";

export const PLAN_TAGLINE = TAGLINE;

export const CHECK_INTRO =
  'Answer a few questions and Lifeport will show the areas your move is likely to affect — from banking, housing and healthcare to documents, pets, licences, tax, storage and family setup.';

export const PLAN_DELIVERY_NOTE = CHECK_INTRO;

export const LIVING_REPORT_PITCH =
  'Get a full, private Lifeport Plan that updates as your move changes — personalised timeline, hidden dependencies, live risk score, document needs, expert questions, and setup packages.';

export const FREE_PRODUCT_NAME = 'Lifeport Check';
export const PAID_PRODUCT_NAME = 'Lifeport Plan';

/** Maps marketing route slugs to product app slugs */
export const APP_ROUTE_SLUGS: Record<string, string> = {
  professionals: 'professionals-to-uk',
  'uk-to-dubai': 'uk-to-dubai',
  'families-uk': 'families-to-uk',
  'students-to-uk': 'students-to-uk',
  'leaving-uk': 'leaving-uk',
};

export function checkHref(marketingSlug: string): string {
  const appSlug = APP_ROUTE_SLUGS[marketingSlug] ?? marketingSlug;
  return `/check?route=${appSlug}`;
}
