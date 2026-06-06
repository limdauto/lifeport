import { ReportIcon } from '@/components/report/ReportIcon';
import {
  DOMAIN_META,
  setupStatusTone,
  type ReportDomain,
} from '@/lib/reportDesign';
import type { MoveStatusItem } from '@/lib/moveStatus';

function MoveStatusCard({
  label,
  value,
  domain,
}: {
  label: string;
  value: string;
  domain: ReportDomain;
}) {
  const meta = DOMAIN_META[domain];
  const tone = setupStatusTone(value);

  return (
    <div
      className={`group flex flex-col gap-4 rounded-2xl border border-outline-variant/10 bg-surface p-4 transition-shadow hover:shadow-sm border-l-4 ${meta.borderClass}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone.iconWrapClass}`}
        >
          <ReportIcon name={meta.icon} size={24} filled={meta.fill} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            {meta.label}
          </p>
          <p className="text-label-md font-semibold text-on-surface">{label}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${tone.pillClass}`}
          >
            {tone.label}
          </span>
          <span className="text-[10px] font-medium text-outline">{tone.progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-outline-variant/20">
          <div
            className={`h-full rounded-full transition-all duration-500 ${tone.barClass}`}
            style={{ width: `${tone.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function MoveStatusGrid({ statuses }: { statuses: MoveStatusItem[] }) {
  if (statuses.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ReportIcon name="tune" className="text-primary" size={20} />
        <p className="text-label-sm font-semibold uppercase tracking-widest text-on-surface-variant">
          Setup status
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {statuses.map((s) => (
          <MoveStatusCard key={s.key} label={s.label} value={s.value} domain={s.domain} />
        ))}
      </div>
    </div>
  );
}
