import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline';
type Size = 'md' | 'sm';

const sizes: Record<Size, string> = {
  md: 'px-6 py-3 text-label-md',
  sm: 'px-4 py-2 text-label-sm',
};

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-fixed border-soft hover:bg-secondary-fixed',
  outline: 'bg-surface-container-lowest text-primary border-soft hover:bg-surface-container-low',
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: Props) {
  const classes = `inline-flex items-center justify-center gap-2 font-semibold transition-colors rounded-DEFAULT ${sizes[size]} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
