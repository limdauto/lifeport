import Image from 'next/image';
import type { MarketingRoute } from '@/data/marketingRoutes';
import { checkHref } from '@/lib/copy';
import { GapComparison } from './GapComparison';
import { PlanCta } from './PlanCta';
import { ProtocolsGrid } from './ProtocolsGrid';

export function RouteLanding({ route }: { route: MarketingRoute }) {
  return (
    <>
      <section className="section">
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="max-w-xl">
              <span className="planner-tag">{route.badge}</span>
              <h1 className="text-display text-on-surface mt-4">{route.title}</h1>
              <p className="text-body-lg text-on-surface-variant mt-6">{route.description}</p>
              <div className="mt-8">
                <PlanCta href={checkHref(route.slug)} />
              </div>
            </div>

            <div className="card shadow-soft-lg">
              <p className="text-label-md font-semibold text-on-surface">What your plan will cover</p>
              <p className="text-body-md text-on-surface-variant mt-2">
                A free Lifeport Check — a first look at friction points, hidden dependencies, and areas
                to review. Unlock your Lifeport Plan for the full picture.
              </p>
              <ul className="mt-6 space-y-3">
                {route.planCoverage.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-body-md text-on-surface-variant">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 overflow-hidden rounded-lg">
                <Image
                  src={route.image}
                  alt={route.imageAlt}
                  className="aspect-[2/1] w-full object-cover"
                  width={500}
                  height={280}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <GapComparison employerItems={route.employerItems} yourItems={route.yourItems} />
      <ProtocolsGrid riskFlags={route.riskFlags} protocols={route.protocols} />

      <section className="section bg-surface-container-low">
        <div className="container-page">
          <div className="pro-support-banner text-center">
            <h2 className="text-headline-lg text-on-surface">Ready for your plan?</h2>
            <p className="text-body-lg text-on-surface-variant mx-auto mt-4 max-w-xl">
              Tell us about your move and we&apos;ll prepare a personalised Lifeport Plan PDF for this
              route — timelines, dependencies, and expert-ready summaries included.
            </p>
            <div className="mt-8 flex justify-center">
              <PlanCta centered href={checkHref(route.slug)} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
