import { Badge } from './Badge';

export function ProtocolsGrid({
  riskFlags,
  protocols,
}: {
  riskFlags: { title: string; description: string }[];
  protocols: { title: string; description: string }[];
}) {
  return (
    <section className="section">
      <div className="container-page">
        <div className="max-w-2xl">
          <h2 className="text-headline-lg text-on-surface">Personal Infrastructure Protocols</h2>
          <p className="text-body-lg text-on-surface-variant mt-4">
            Systematic management of high-risk settlement failure points.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {riskFlags.map((flag) => (
            <article key={flag.title} className="card overflow-hidden !p-0">
              <div className="flex items-center gap-2 bg-error-container/50 px-6 py-3">
                <span className="text-sm text-on-error-container" aria-hidden>
                  ⚑
                </span>
                <Badge variant="friction">Risk Flag</Badge>
              </div>
              <div className="p-6">
                <h3 className="text-label-md text-on-surface">{flag.title}</h3>
                <p className="text-body-md text-on-surface-variant mt-2">{flag.description}</p>
              </div>
            </article>
          ))}
          {protocols.map((proto) => (
            <article key={proto.title} className="card">
              <h3 className="text-label-md text-on-surface">{proto.title}</h3>
              <p className="text-body-md text-on-surface-variant mt-2">{proto.description}</p>
            </article>
          ))}
          <article className="rounded-lg bg-primary p-8 text-on-primary shadow-soft sm:col-span-2 lg:col-span-1">
            <h3 className="text-label-md">First 90-day Plan</h3>
            <p className="text-body-md mt-2 opacity-90">
              A sequenced checklist for your critical first three months — prioritized by
              dependencies and deadlines.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
