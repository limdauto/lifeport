'use client';

import { ReportIcon } from '@/components/report/ReportIcon';

type TipProps = {
  text: string;
  label?: string;
  /** Wider panel for section-level guidance. */
  wide?: boolean;
  /** Prefer below the icon when near the top of the viewport. */
  placement?: 'above' | 'below';
  size?: 'sm' | 'md';
  heading?: string;
};

export function FieldInfoTip({
  text,
  label = 'More info',
  wide = false,
  placement = 'above',
  size = 'sm',
  heading,
}: TipProps) {
  const iconSize = size === 'md' ? 18 : 16;
  const buttonSize = size === 'md' ? 'h-6 w-6' : 'h-5 w-5';

  return (
    <span className="group/info relative ml-1.5 inline-flex align-middle">
      <button
        type="button"
        aria-label={`${label}: ${text}`}
        className={`inline-flex ${buttonSize} items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container-high hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
      >
        <ReportIcon name="info" size={iconSize} />
      </button>
      <span
        role="tooltip"
        className={`pointer-events-none absolute left-1/2 z-30 hidden -translate-x-1/2 rounded-xl border border-outline-variant/30 bg-inverse-surface px-3.5 py-3 text-left text-xs leading-relaxed text-inverse-on-surface shadow-lg group-hover/info:block group-focus-within/info:block ${
          wide ? 'w-[min(20rem,calc(100vw-2rem))]' : 'w-64'
        } ${placement === 'below' ? 'top-full left-0 mt-2 translate-x-0 sm:left-1/2 sm:-translate-x-1/2' : 'bottom-full mb-2'}`}
      >
        {heading ? (
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-inverse-on-surface/70">
            {heading}
          </span>
        ) : null}
        {text}
        <span
          className={`absolute h-2 w-2 rotate-45 border-outline-variant/30 bg-inverse-surface ${
            placement === 'below'
              ? 'bottom-full left-4 mb-[-5px] border-l border-t sm:left-1/2 sm:-translate-x-1/2'
              : 'left-1/2 top-full -mt-px -translate-x-1/2 border-b border-r'
          }`}
        />
      </span>
    </span>
  );
}

export function GlossaryTermChip({ label, text }: { label: string; text: string }) {
  return (
    <span className="group/info relative inline-flex">
      <button
        type="button"
        aria-label={`${label}: ${text}`}
        className="inline-flex items-center gap-1 rounded-full border border-outline-variant/30 bg-surface-container-lowest px-2.5 py-1 text-xs font-medium text-on-surface-variant transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {label}
        <ReportIcon name="info" size={14} />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 hidden w-56 rounded-xl border border-outline-variant/30 bg-inverse-surface px-3 py-2.5 text-left text-xs leading-relaxed text-inverse-on-surface shadow-lg group-hover/info:block group-focus-within/info:block"
      >
        <span className="mb-1 block font-semibold">{label}</span>
        {text}
      </span>
    </span>
  );
}
