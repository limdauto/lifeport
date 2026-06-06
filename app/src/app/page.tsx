import { FrictionCards } from '@/components/marketing/FrictionCards';
import { Hero } from '@/components/marketing/Hero';
import { PlanIncludes } from '@/components/marketing/PlanIncludes';
import { PlanCta } from '@/components/marketing/PlanCta';
import { PlannerSection } from '@/components/marketing/PlannerSection';
import { PopularRoutes } from '@/components/marketing/PopularRoutes';
import { ProfessionalSupport } from '@/components/marketing/ProfessionalSupport';
import { SetupPackages } from '@/components/marketing/SetupPackages';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FrictionCards />
      <PlannerSection />
      <PlanIncludes />
      <PopularRoutes />
      <ProfessionalSupport />
      <SetupPackages />
      <section className="section">
        <div className="container-page text-center">
          <PlanCta centered />
        </div>
      </section>
    </>
  );
}
