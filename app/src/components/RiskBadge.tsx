const styles: Record<string, string> = {
  low: 'bg-primary-fixed text-on-primary-fixed',
  medium: 'bg-secondary-fixed text-on-secondary-fixed',
  high: 'bg-error-container text-on-error-container',
  critical: 'bg-error text-on-error',
  unknown: 'bg-surface-container-high text-on-surface-variant',
};

export function RiskBadge({ level }: { level?: string }) {
  if (!level) return null;
  const label = level.charAt(0).toUpperCase() + level.slice(1);
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[level] ?? styles.unknown}`}
    >
      {label} risk
    </span>
  );
}
