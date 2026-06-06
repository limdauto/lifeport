import { CheckoutPage } from '@/components/CheckoutPage';
import type { Id } from 'convex/_generated/dataModel';
import { notFound } from 'next/navigation';

export default async function Checkout({
  searchParams,
}: {
  searchParams: Promise<{ caseId?: string }>;
}) {
  const { caseId } = await searchParams;
  if (!caseId) notFound();
  return <CheckoutPage caseId={caseId as Id<'cases'>} />;
}
