import Link from 'next/link';
import { Logo } from './Logo';

const domains = ['Immigration', 'Tax', 'Banking', 'Housing'];
const company = ['Our Mission', 'About Us', 'Contact'];
const legal = ['Legal', 'Compliance', 'Privacy'];

export function Footer() {
  return (
    <footer className="bg-surface-container-low">
      <div className="container-page section">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <Logo size="sm" />
            </Link>
            <p className="mt-6 text-label-sm leading-relaxed text-on-surface-variant">
              Lifeport is not a replacement for regulated legal, tax, or financial advice. Always
              consult qualified professionals for your specific situation.
            </p>
            <p className="mt-4 text-label-sm text-outline">&copy; 2024 Lifeport</p>
          </div>

          <div>
            <h3 className="text-label-md text-on-surface mb-4">Domains</h3>
            <ul className="space-y-3">
              {domains.map((item) => (
                <li key={item}>
                  <span className="text-body-md text-on-surface-variant">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-label-md text-on-surface mb-4">Company</h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item}>
                  <span className="text-body-md text-on-surface-variant">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-label-md text-on-surface mb-4">Legal</h3>
            <ul className="space-y-3">
              {legal.map((item) => (
                <li key={item}>
                  <span className="text-body-md text-on-surface-variant">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
