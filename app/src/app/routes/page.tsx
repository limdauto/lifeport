import type { Metadata } from 'next';
import Link from 'next/link';
import { PlanCta } from '@/components/marketing/PlanCta';
import { marketingRoutes, routePageHrefs } from '@/data/marketingRoutes';
import { PLAN_TAGLINE } from '@/lib/copy';

export const metadata: Metadata = {
  title: 'Lifeport — Relocation Routes',
  description: 'Choose your relocation route and order a personalised Lifeport Plan PDF.',
};

export default function RoutesIndexPage() {
  return (
    <section className="section">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="planner-tag">Relocation Routes</span>
          <h1 className="text-display text-on-surface mt-6">Every move has a different critical path</h1>
          <p className="text-body-lg text-on-surface-variant mt-4">
            {PLAN_TAGLINE} Pick the route closest to your situation — each one becomes a tailored
            Lifeport Plan PDF.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {marketingRoutes.map((route) => (
            <Link
              key={route.slug}
              href={routePageHrefs[route.slug] ?? `/routes/${route.slug}`}
              className="group flex items-center gap-6 rounded-xl bg-tertiary-fixed p-8 transition-colors hover:bg-tertiary-fixed-dim"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest text-primary shadow-soft">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M3 12h18M12 3v18" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-label-sm font-semibold tracking-wide text-on-tertiary-fixed-variant">
                  {route.label}
                </p>
                <h2 className="text-headline-md text-on-surface mt-1 transition-colors group-hover:text-primary">
                  {route.badge}
                </h2>
                <p className="text-body-md text-on-surface-variant mt-1 line-clamp-2">
                  {route.description}
                </p>
              </div>
              <p className="hidden shrink-0 text-label-sm font-semibold text-primary md:block">
                View route →
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <PlanCta />
        </div>
      </div>
    </section>
  );
}
