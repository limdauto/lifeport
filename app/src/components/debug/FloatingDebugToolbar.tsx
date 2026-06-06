'use client';

import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isDebugEnabled } from '@/lib/debug/enabled';
import { ROUTE_CONFIGS, type RouteKey } from '@/lib/routes';

export function FloatingDebugToolbar() {
  const pathname = usePathname();
  const viewer = useQuery(api.users.viewer);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [routeKey, setRouteKey] = useState<RouteKey>(ROUTE_CONFIGS[0]?.routeKey ?? 'uk_to_dubai');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const match = pathname?.match(/^\/debug\/(?:check|living)\/([^/]+)/);
    if (match?.[1] && ROUTE_CONFIGS.some((r) => r.routeKey === match[1])) {
      setRouteKey(match[1] as RouteKey);
    }
  }, [pathname]);

  if (!mounted || !isDebugEnabled() || !viewer?.isAdmin) return null;

  const route = ROUTE_CONFIGS.find((r) => r.routeKey === routeKey) ?? ROUTE_CONFIGS[0];

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[200] flex flex-col items-end gap-2"
      aria-label="Debug toolbar"
    >
      {open ? (
        <div className="pointer-events-auto w-[min(100vw-2rem,20rem)] overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-2xl">
          <div className="flex items-center justify-between border-b border-outline-variant/30 bg-secondary-container/40 px-3 py-2">
            <span className="text-label-sm font-bold uppercase tracking-wider text-on-secondary-container">
              Debug routes
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-label-sm text-on-surface-variant hover:bg-surface-container"
              aria-label="Collapse debug toolbar"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 p-3">
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
                Test route
              </span>
              <select
                value={routeKey}
                onChange={(e) => setRouteKey(e.target.value as RouteKey)}
                className="mt-1 w-full rounded-lg border border-outline-variant/50 bg-surface-container px-3 py-2 text-label-md text-on-surface"
              >
                {ROUTE_CONFIGS.map((r) => (
                  <option key={r.routeKey} value={r.routeKey}>
                    {r.title}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <DebugLink href={`/debug/check/${routeKey}`} label="Check" />
              <DebugLink href={`/debug/living/${routeKey}`} label="Plan" />
              <DebugLink href={`/debug/living/${routeKey}?tab=inputs`} label="Inputs" />
              <DebugLink href={`/debug/living/${routeKey}?tab=packages`} label="Packages" />
            </div>

            <Link
              href="/debug"
              className="block rounded-lg border border-dashed border-outline-variant/50 px-3 py-2 text-center text-label-sm font-medium text-on-surface-variant hover:bg-surface-container-low"
            >
              All debug screens →
            </Link>

            {route ? (
              <p className="text-center text-[10px] text-on-surface-variant/80">
                {Object.keys(route.riskScoring.fields).length} risk fields · £{route.livingPriceGbp}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary px-4 py-2.5 text-label-md font-bold text-on-secondary shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
        aria-expanded={open}
      >
        <span className="flex h-2 w-2 rounded-full bg-on-secondary" aria-hidden />
        Debug
      </button>
    </div>
  );
}

function DebugLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg bg-primary px-3 py-2 text-center text-label-sm font-semibold text-on-primary hover:opacity-90"
    >
      {label}
    </Link>
  );
}
