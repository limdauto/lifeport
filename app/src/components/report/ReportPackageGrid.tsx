import { Button } from '@/components/marketing/Button';
import { ReportIcon } from '@/components/report/ReportIcon';
import { DOMAIN_META, inferDomain } from '@/lib/reportDesign';

export type ReportPackageItem = {
  _id: string;
  title: string;
  reason: string;
  priceFrom?: number;
  outcome?: string;
  packageKey?: string;
  status?: string;
};

export function ReportPackageGrid({
  packages,
  title = 'Setup packages to consider',
  showRequest,
  onRequest,
  requestingKey,
}: {
  packages: ReportPackageItem[];
  title?: string;
  showRequest?: boolean;
  onRequest?: (packageKey: string) => void | Promise<void>;
  requestingKey?: string | null;
}) {
  if (packages.length === 0) return null;

  return (
    <div>
      <h3 className="text-headline-md font-medium text-on-surface">{title}</h3>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {packages.map((pkg) => {
          const domain = inferDomain(`${pkg.title} ${pkg.reason} ${pkg.outcome ?? ''}`);
          const meta = DOMAIN_META[domain];
          const requested = pkg.status === 'requested';
          const requesting = requestingKey === pkg.packageKey;

          return (
            <article
              key={pkg._id}
              className={`report-soft-shadow group rounded-3xl border border-outline-variant/10 border-t-4 bg-surface-container-lowest p-8 transition-all hover:-translate-y-0.5 ${meta.borderClass.replace('border-l-', 'border-t-')}`}
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <ReportIcon name={meta.icon} className={`${meta.colorClass} text-sm`} size={18} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${meta.colorClass}`}>
                    {meta.label}
                  </span>
                </div>
                {!showRequest ? (
                  <ReportIcon
                    name="arrow_forward"
                    className="text-primary transition-transform group-hover:translate-x-1"
                  />
                ) : null}
              </div>
              <h4 className="text-headline-md font-medium text-on-surface">{pkg.title}</h4>
              {pkg.outcome ? (
                <p className="mt-3 text-body-md text-on-surface-variant">{pkg.outcome}</p>
              ) : null}
              <p className="mt-3 text-body-md text-on-surface-variant/90">{pkg.reason}</p>
              {pkg.priceFrom != null ? (
                <p className="mt-6 text-label-md font-bold text-primary">From £{pkg.priceFrom}</p>
              ) : null}
              {showRequest && pkg.packageKey && onRequest ? (
                <Button
                  size="sm"
                  variant={requested ? 'outline' : 'primary'}
                  className="mt-6"
                  disabled={requested || requesting}
                  onClick={() => onRequest(pkg.packageKey!)}
                >
                  {requested ? 'Requested' : requesting ? 'Requesting…' : 'Request package'}
                </Button>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
