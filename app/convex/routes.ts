import { v } from 'convex/values';
import { query } from './_generated/server';
import { ROUTE_CONFIGS, getRouteBySlug as findRouteBySlug } from './lib/routeConfigs';

export const listRoutes = query({
  args: {},
  handler: async () => ROUTE_CONFIGS,
});

export const getRouteBySlug = query({
  args: { slug: v.string() },
  handler: async (_ctx, args) => findRouteBySlug(args.slug) ?? null,
});
