import Link from 'next/link';
import { Button } from '@/components/marketing/Button';
import { marketingRoutes, routePageHrefs } from '@/data/marketingRoutes';

export default function NotFound() {
  return (
    <div className="container-page section">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-display text-on-surface">Page not found</h1>
        <p className="text-body-lg text-on-surface-variant mt-3">
          That page doesn&apos;t exist. Pick a relocation route below.
        </p>
        <ul className="mt-8 space-y-2 text-left">
          {marketingRoutes.map((route) => (
            <li key={route.slug}>
              <Link
                href={routePageHrefs[route.slug] ?? `/routes/${route.slug}`}
                className="text-body-md font-medium text-primary hover:underline"
              >
                {route.badge}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button href="/">Back to home</Button>
        </div>
      </div>
    </div>
  );
}
