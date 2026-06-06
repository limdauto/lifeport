import Image from 'next/image';
import { HERO_HEADLINE, HERO_SUBHEAD } from '@/lib/copy';
import { PlanCta } from './PlanCta';

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="container-page section">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <span className="friction-tag">Free Lifeport Check</span>
            <h1 className="text-display text-on-surface mt-6">{HERO_HEADLINE}</h1>
            <p className="text-body-lg text-on-surface-variant mt-6">{HERO_SUBHEAD}</p>
            <div className="mt-8">
              <PlanCta />
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-xl shadow-soft-lg">
              <Image
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop&q=80"
                alt="A couple looking out over a city skyline at sunset"
                className="aspect-[4/3] w-full object-cover"
                width={800}
                height={600}
                priority
              />
            </div>
            <div className="card absolute -bottom-4 -left-4 hidden !p-4 md:block" aria-hidden>
              <p className="text-label-sm text-on-surface-variant">Moves checked</p>
              <p className="text-headline-md font-semibold text-primary">2,400+</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
