import Link from 'next/link';
import { DebugBanner } from '@/components/debug/DebugBanner';
import { ROUTE_CONFIGS } from '@/lib/routes';
import { PAID_PRODUCT_NAME } from '@/lib/copy';

export default function DebugHubPage() {

  return (
    <div className="container-page section mx-auto max-w-3xl">
      <DebugBanner label="Lifeport UI debug hub" />

      <h1 className="mt-8 text-display text-on-surface">Debug previews</h1>
      <p className="mt-3 text-body-lg text-on-surface-variant">
        Open reports and screens with stubbed intake data — no forms, checkout, or Convex cases
        required. Available in development (or when{' '}
        <code className="rounded bg-surface-container px-1.5 py-0.5 text-label-sm">
          NEXT_PUBLIC_ENABLE_DEBUG=true
        </code>
        ).
      </p>

      <div className="mt-10 space-y-8">
        {ROUTE_CONFIGS.map((route) => (
          <section
            key={route.routeKey}
            className="report-soft-shadow rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-6"
          >
            <h2 className="text-headline-sm font-medium text-on-surface">{route.title}</h2>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Risk fields: {Object.keys(route.riskScoring.fields).length} · Living £
              {route.livingPriceGbp}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/debug/check/${route.routeKey}`}
                className="rounded-xl border border-outline-variant/50 bg-surface-container px-4 py-2 text-label-md font-semibold text-primary hover:bg-surface-container-high"
              >
                Lifeport Check
              </Link>
              <Link
                href={`/debug/living/${route.routeKey}`}
                className="rounded-xl border border-outline-variant/50 bg-surface-container px-4 py-2 text-label-md font-semibold text-primary hover:bg-surface-container-high"
              >
                {PAID_PRODUCT_NAME}
              </Link>
              <Link
                href={`/debug/living/${route.routeKey}?tab=inputs`}
                className="rounded-xl border border-outline-variant/50 px-4 py-2 text-label-md font-semibold text-on-surface-variant hover:bg-surface-container-low"
              >
                Inputs tab
              </Link>
              <Link
                href={`/debug/living/${route.routeKey}?tab=packages`}
                className="rounded-xl border border-outline-variant/50 px-4 py-2 text-label-md font-semibold text-on-surface-variant hover:bg-surface-container-low"
              >
                Packages tab
              </Link>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
