import type { Metadata } from 'next';
import { RouteLanding } from '@/components/marketing/RouteLanding';
import { getMarketingRoute } from '@/data/marketingRoutes';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Lifeport — UK Arrival Plan for Professionals',
  description:
    'Your company moves your job. Order a personalised Lifeport Plan PDF for your UK arrival.',
};

export default function ProfessionalsPage() {
  const route = getMarketingRoute('professionals');
  if (!route) notFound();
  return <RouteLanding route={route} />;
}
