import { PLAN_CTA, PLAN_CTA_HREF, PLAN_DELIVERY_NOTE } from '@/lib/copy';
import { Button } from './Button';

export function PlanCta({
  centered = false,
  href = PLAN_CTA_HREF,
  label = PLAN_CTA,
  className = '',
}: {
  centered?: boolean;
  href?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div className={`${centered ? 'text-center' : ''} ${className}`}>
      <Button href={href}>{label}</Button>
      <p
        className={`text-label-sm text-on-surface-variant mt-3 ${centered ? 'mx-auto max-w-md' : ''}`}
      >
        {PLAN_DELIVERY_NOTE}
      </p>
    </div>
  );
}
