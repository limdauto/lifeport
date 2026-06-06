import type { RouteKey } from '@/lib/routes';

export type DebugLivingTab = 'report' | 'inputs' | 'packages';

export function debugLivingPath(routeKey: RouteKey, tab: DebugLivingTab = 'report'): string {
  const base = `/debug/living/${routeKey}`;
  return tab === 'report' ? base : `${base}?tab=${tab}`;
}

export function debugCheckPath(routeKey: RouteKey): string {
  return `/debug/check/${routeKey}`;
}
