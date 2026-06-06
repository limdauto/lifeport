import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RouteLanding } from '@/components/marketing/RouteLanding';
import { getMarketingRoute } from '@/data/marketingRoutes';

const ROUTE_SLUGS = ['uk-to-dubai', 'families-uk'] as const;

export function generateStaticParams() {
  return ROUTE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = getMarketingRoute(slug);
  if (!route) return { title: 'Lifeport' };
  return {
    title: `Lifeport — ${route.badge}`,
    description: route.description,
  };
}

export default async function MarketingRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const route = getMarketingRoute(slug);
  if (!route || slug === 'professionals') notFound();
  return <RouteLanding route={route} />;
}
