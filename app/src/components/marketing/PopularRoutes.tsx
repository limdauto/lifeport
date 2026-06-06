import Link from 'next/link';

const routes = [
  {
    label: 'Popular Route',
    title: 'UK to Dubai',
    description: 'Tax-efficient relocation for professionals and entrepreneurs.',
    href: '/routes/uk-to-dubai',
  },
  {
    label: 'Use-Case',
    title: 'Professionals moving to the UK',
    description: 'Skilled worker visas, banking, and first 90-day settlement.',
    href: '/professionals',
  },
  {
    label: 'Complex Move',
    title: 'Families moving to the UK',
    description: 'Schools, spouse visas, and multi-dependency planning.',
    href: '/routes/families-uk',
  },
];

export function PopularRoutes() {
  return (
    <section id="routes" className="section">
      <div className="container-page">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-headline-lg text-on-surface">Popular Routes</h2>
          <Link href="/routes" className="text-label-md shrink-0 text-primary hover:underline">
            View all routes
          </Link>
        </div>

        <div className="mt-10 space-y-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="group flex items-center gap-6 rounded-xl bg-tertiary-fixed p-8 transition-colors hover:bg-tertiary-fixed-dim"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest text-primary shadow-soft">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M3 12h18M12 3v18" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-label-sm font-semibold tracking-wide text-on-tertiary-fixed-variant">
                  {route.label}
                </p>
                <h3 className="text-headline-md text-on-surface mt-1 transition-colors group-hover:text-primary">
                  {route.title}
                </h3>
                <p className="text-body-md text-on-surface-variant mt-1">{route.description}</p>
              </div>
              <svg
                className="hidden h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1 md:block"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
