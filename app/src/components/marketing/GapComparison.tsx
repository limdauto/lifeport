export function GapComparison({
  employerItems,
  yourItems,
}: {
  employerItems: string[];
  yourItems: string[];
}) {
  return (
    <section className="section bg-surface-container-low">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-headline-lg text-on-surface">
            The Gap: What your employer doesn&apos;t handle
          </h2>
          <p className="text-body-lg text-on-surface-variant mt-4">
            Corporate relocation covers the job. Everything else — your family&apos;s life
            infrastructure — is on you.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="card">
            <h3 className="text-label-md uppercase tracking-wide text-on-surface-variant">
              Employer Support
            </h3>
            <ul className="mt-6 space-y-3">
              {employerItems.map((item) => (
                <li key={item} className="flex items-center gap-3 text-body-md text-on-surface-variant">
                  <span className="text-outline">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card border-soft !shadow-soft-lg ring-1 ring-primary/20">
            <h3 className="text-label-md uppercase tracking-wide text-primary">Your Responsibility</h3>
            <ul className="mt-6 space-y-3">
              {yourItems.map((item) => (
                <li key={item} className="flex items-center gap-3 text-body-md text-on-surface">
                  <svg className="h-4 w-4 shrink-0 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2L2 22h20L12 2z" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
