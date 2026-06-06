import { PlanProductPreview } from './PlanProductPreview';

const steps = [
  {
    icon: 'profile' as const,
    title: 'Tell us your story',
    description:
      'Share your origin, destination, family, timeline, and priorities — we handle the complexity.',
  },
  {
    icon: 'plan' as const,
    title: 'We build your plan',
    description:
      'Our team maps dependencies, risk flags, and sequenced actions for your specific move.',
  },
  {
    icon: 'execution' as const,
    title: 'Your Lifeport Plan goes live',
    description:
      'A private, updatable plan with timeline, risk score, expert questions, and setup packages — ready to act on.',
  },
];

function StepIcon({ icon }: { icon: 'profile' | 'plan' | 'execution' }) {
  if (icon === 'profile') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20v-1a6 6 0 0112 0v1" strokeLinecap="round" />
        <path d="M17 8l1 1 2-2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (icon === 'plan') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M9 6h11M9 12h11M9 18h11" strokeLinecap="round" />
        <path d="M4 6h.01M4 12h.01M4 18h.01" strokeLinecap="round" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlannerSection() {
  return (
    <section id="planner" className="section bg-surface-container-low">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="planner-tag">Your Lifeport Plan</span>
          <h2 className="text-headline-lg text-on-surface mt-6">One plan. Everything mapped.</h2>
          <p className="text-body-lg text-on-surface-variant mt-4">
            Your move plan lives in one place — sections, live risk score, inputs that refresh the
            report, and packages when you want hands-on help.
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="text-center">
              <div className="planner-step-icon mx-auto">
                <StepIcon icon={step.icon} />
              </div>
              <p className="text-label-sm font-semibold text-primary mt-5">Step {i + 1}</p>
              <h3 className="text-headline-md text-on-surface mt-1">{step.title}</h3>
              <p className="text-body-md text-on-surface-variant mt-2">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-2xl text-center">
          <p className="text-label-sm text-outline">Preview — the actual Lifeport Plan experience</p>
        </div>

        <div className="mt-6">
          <PlanProductPreview />
        </div>
      </div>
    </section>
  );
}
