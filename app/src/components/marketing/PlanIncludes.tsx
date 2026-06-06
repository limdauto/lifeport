const features = [
  { title: 'Timeline', description: 'Sequenced move timeline with dependencies' },
  { title: 'Documents', description: 'Checklist of required paperwork' },
  { title: 'Visa & Admin', description: 'Immigration steps and deadlines' },
  { title: 'Banking', description: 'Account setup and transfer guidance' },
  { title: 'Tax Guidance', description: 'Residency and filing considerations' },
  { title: 'Housing', description: 'Lease requirements and guarantors' },
  { title: 'Healthcare', description: 'Insurance and registration steps' },
  { title: 'Family', description: 'Spouse and dependent considerations' },
  { title: 'Estate Planning', description: 'Wills and asset protection' },
  { title: 'Childcare & Schools', description: 'Enrollment and nursery planning' },
];

export function PlanIncludes() {
  return (
    <section className="section bg-surface-container-low">
      <div className="container-page">
        <h2 className="text-headline-lg text-on-surface text-center">
          What&apos;s in your Lifeport Plan PDF
        </h2>
        <p className="text-body-lg text-on-surface-variant mx-auto mt-4 max-w-2xl text-center">
          Every plan is prepared individually. These are the sections we map for your move.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-DEFAULT bg-tertiary-fixed text-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="text-label-md text-on-surface">{feature.title}</h3>
                <p className="text-body-md text-on-surface-variant mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
