import { ReportIcon } from '@/components/report/ReportIcon';

const packages = [
  {
    icon: 'account_balance',
    title: 'Banking Setup',
    quote: '"I need a local account before I can sign a lease."',
    items: ['Pre-arrival account guidance', 'Document checklist', 'Transfer timeline'],
  },
  {
    icon: 'key',
    title: 'Housing Readiness',
    quote: '"No credit history, no guarantor, no lease."',
    items: ['Guarantor alternatives', 'Deposit requirements', 'Agency shortlist'],
  },
  {
    icon: 'health_and_safety',
    title: 'Healthcare Setup',
    quote: '"I don\'t know how to register with the local system."',
    items: ['Insurance options', 'Registration steps', 'Family coverage'],
  },
  {
    icon: 'family_restroom',
    title: 'Family Arrival Pack',
    quote: '"My spouse\'s visa depends on mine, but schools need an address."',
    items: ['Dependent visa sequencing', 'School enrollment', 'Nursery waitlists'],
  },
  {
    icon: 'receipt_long',
    title: 'Tax Residence Packet',
    quote: '"I might be tax resident in two countries at once."',
    items: ['Split-year analysis', 'Filing obligations', 'Asset review'],
  },
  {
    icon: 'calendar_month',
    title: 'First 90 Days Concierge',
    quote: '"The first three months are a blur of admin."',
    items: ['Priority task ordering', 'Weekly check-ins', 'Expert handoffs'],
  },
] as const;

export function SetupPackages() {
  return (
    <section id="packages" className="section bg-surface-container-low">
      <div className="container-page">
        <div className="max-w-2xl">
          <h2 className="text-headline-lg text-on-surface">Add the setup help you need</h2>
          <p className="text-body-lg text-on-surface-variant mt-4">
            Optional add-ons to complement your Lifeport Plan PDF — hands-on help for the hardest
            parts of your move.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <article key={pkg.title} className="card">
              <div className="flex h-10 w-10 items-center justify-center rounded-DEFAULT bg-tertiary-fixed text-primary">
                <ReportIcon name={pkg.icon} size={22} />
              </div>
              <h3 className="text-label-md text-on-surface mt-4">{pkg.title}</h3>
              <p className="text-body-md text-on-surface-variant mt-2 italic">{pkg.quote}</p>
              <ul className="mt-4 space-y-3">
                {pkg.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-body-md text-on-surface-variant">
                    <ReportIcon
                      name="subdirectory_arrow_right"
                      size={18}
                      className="mt-0.5 shrink-0 text-primary"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
