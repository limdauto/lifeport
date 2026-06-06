import { notFound } from 'next/navigation';
import { CheckIntakeForm } from '@/components/CheckIntakeForm';
import { getRouteBySlug } from '@/lib/routes';

export default async function CheckIntakePage({
  searchParams,
}: {
  searchParams: Promise<{ route?: string; upgrade?: string }>;
}) {
  const { route: routeSlug, upgrade } = await searchParams;
  if (!routeSlug) notFound();

  const route = getRouteBySlug(routeSlug);
  if (!route) notFound();

  return <CheckIntakeForm route={route} showUpgradeNote={upgrade === '1'} />;
}
