import { ReactNode } from 'react';

const styles = {
  default: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  friction: 'bg-error-container text-on-error-container',
  accent: 'bg-primary-fixed text-on-primary-fixed-variant',
};

export function Badge({
  variant = 'default',
  children,
}: {
  variant?: keyof typeof styles;
  children: ReactNode;
}) {
  return <span className={`chip ${styles[variant]}`}>{children}</span>;
}
