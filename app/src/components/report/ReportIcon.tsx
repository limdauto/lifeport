export function ReportIcon({
  name,
  className = '',
  filled = false,
  size = 24,
}: {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
}) {
  return (
    <span
      className={`material-symbols-outlined inline-block align-middle leading-none ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
      }}
      aria-hidden
    >
      {name}
    </span>
  );
}
