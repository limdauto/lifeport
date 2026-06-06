import type { Metadata } from 'next';
import { PlanCta } from '@/components/marketing/PlanCta';
import { SetupPackages } from '@/components/marketing/SetupPackages';
import { PLAN_DELIVERY_NOTE } from '@/lib/copy';

export const metadata: Metadata = {
  title: 'Lifeport — Pricing',
  description:
    'Order your personalised Lifeport Plan PDF. One clear plan for your move, prepared by our team.',
};

const plans = [
  {
    name: 'Lifeport Plan',
    price: '£149',
    period: 'one-off',
    description:
      'Your personalised relocation plan as a PDF — risk map, timeline, dependencies, and expert-ready summaries.',
    features: [
      'Personalised to your route and family',
      'Risk map with priority flags',
      'Sequenced 3-month timeline',
      'Document and action checklists',
      'Expert-ready summary packets',
      'Delivered within 5 working days',
    ],
    featured: true,
  },
  {
    name: 'Plan + Expert Review',
    price: '£399',
    period: 'one-off',
    description: 'Your Lifeport Plan PDF plus a review session with a vetted relocation specialist.',
    features: [
      'Everything in Lifeport Plan',
      '1× specialist review of your plan',
      'Annotated risk and priority report',
      'Follow-up summary by email',
    ],
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="section">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="planner-tag">Pricing</span>
            <h1 className="text-display text-on-surface mt-6">One plan. One price. No subscriptions.</h1>
            <p className="text-body-lg text-on-surface-variant mt-4">
              You tell us about your move. We prepare your personalised Lifeport Plan PDF. You act on
              it — or hand it straight to your lawyer, accountant, or relocation adviser.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-8 lg:grid-cols-2">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`card flex flex-col ${plan.featured ? 'shadow-soft-lg ring-2 ring-primary/25' : ''}`}
              >
                {plan.featured && <span className="planner-tag mb-4 self-start">Most popular</span>}
                <h2 className="text-headline-md text-on-surface">{plan.name}</h2>
                <p className="mt-2">
                  <span className="text-display text-primary">{plan.price}</span>
                  <span className="text-body-md text-on-surface-variant ml-2">{plan.period}</span>
                </p>
                <p className="text-body-md text-on-surface-variant mt-4">{plan.description}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-body-md text-on-surface-variant">
                      <svg className="h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <PlanCta />
                </div>
              </article>
            ))}
          </div>

          <p className="text-body-md text-on-surface-variant mx-auto mt-8 max-w-lg text-center">
            {PLAN_DELIVERY_NOTE}
          </p>
        </div>
      </section>
      <SetupPackages />
    </>
  );
}
