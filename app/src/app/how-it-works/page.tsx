import type { Metadata } from 'next';
import { PlanCta } from '@/components/marketing/PlanCta';
import { PlanIncludes } from '@/components/marketing/PlanIncludes';
import { PlannerSection } from '@/components/marketing/PlannerSection';
import { ProfessionalSupport } from '@/components/marketing/ProfessionalSupport';
import { PLAN_TAGLINE } from '@/lib/copy';

export const metadata: Metadata = {
  title: 'Lifeport — How It Works',
  description: 'Tell us about your move, we prepare your personalised Lifeport Plan PDF.',
};

export default function HowItWorksPage() {
  return (
    <>
      <section className="section">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="planner-tag">How It Works</span>
            <h1 className="text-display text-on-surface mt-6">From chaos to a plan in three steps</h1>
            <p className="text-body-lg text-on-surface-variant mt-4">{PLAN_TAGLINE}</p>
            <div className="mt-8 flex justify-center">
              <PlanCta centered />
            </div>
          </div>
        </div>
      </section>
      <PlannerSection />
      <PlanIncludes />
      <ProfessionalSupport />
    </>
  );
}
