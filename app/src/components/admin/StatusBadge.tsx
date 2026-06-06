import {
  caseStatusLabel,
  caseStatusTone,
  jobStatusLabel,
  jobTypeLabel,
  packageStatusLabel,
  reportStatusLabel,
  sectionStatusLabel,
} from '@/lib/statusLabels';

type StatusKind = 'case' | 'report' | 'section' | 'package' | 'job';

function labelFor(kind: StatusKind, code: string, jobType?: string): string {
  switch (kind) {
    case 'case':
      return caseStatusLabel(code);
    case 'report':
      return reportStatusLabel(code);
    case 'section':
      return sectionStatusLabel(code);
    case 'package':
      return packageStatusLabel(code);
    case 'job':
      return jobType ? `${jobTypeLabel(jobType)} · ${jobStatusLabel(code)}` : jobStatusLabel(code);
  }
}

export function StatusBadge({
  kind,
  status,
  jobType,
  className = '',
}: {
  kind: StatusKind;
  status: string;
  jobType?: string;
  className?: string;
}) {
  const tone = kind === 'case' ? caseStatusTone(status) : 'bg-surface-container-high text-on-surface-variant';

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone} ${className}`}
    >
      {labelFor(kind, status, jobType)}
    </span>
  );
}
