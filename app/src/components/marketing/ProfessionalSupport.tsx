import { PLAN_CTA_HREF } from '@/lib/copy';
import { Button } from './Button';

export function ProfessionalSupport() {
  return (
    <section className="section bg-surface-container-low">
      <div className="container-page">
        <div className="pro-support-banner flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <span className="planner-tag">Professional Support</span>
            <h2 className="text-headline-lg text-on-surface mt-6">
              Built for planning. Ready for experts.
            </h2>
            <p className="text-body-lg text-on-surface-variant mt-4">
              Your Lifeport Plan PDF is structured so lawyers, accountants, tax advisers, and
              relocation specialists can review the right information faster — no scattered notes or
              missing context.
            </p>
          </div>
          <Button href={PLAN_CTA_HREF} variant="outline" className="shrink-0">
            Check my move
          </Button>
        </div>
      </div>
    </section>
  );
}
