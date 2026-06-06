'use client';

import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { api } from 'convex/_generated/api';
import { FieldInfoTip } from '@/components/FieldInfoTip';
import { IntakeField } from '@/components/IntakeField';
import { Button } from '@/components/marketing/Button';
import { CHECK_CTA, CHECK_INTRO, FREE_PRODUCT_NAME, LIVING_CTA } from '@/lib/copy';
import { checkFieldsForRoute, groupCheckFieldsIntoSteps } from '@/lib/fieldDefs';
import { checkStepGuidance } from '@/lib/fieldGlossary';
import type { RouteConfig } from '@/lib/routes';

type Props = {
  route: RouteConfig;
  showUpgradeNote?: boolean;
};

export function CheckIntakeForm({ route, showUpgradeNote }: Props) {
  const router = useRouter();
  const submitCheck = useMutation(api.intake.submitCheck);
  const [stepIndex, setStepIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'back'>('forward');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = useMemo(
    () => groupCheckFieldsIntoSteps(checkFieldsForRoute(route.checkFields)),
    [route.checkFields],
  );
  const currentStep = steps[stepIndex];

  const defaultOrigin = route.routeKey === 'uk_to_dubai' || route.routeKey === 'leaving_uk' ? 'United Kingdom' : '';
  const defaultDestination =
    route.routeKey.includes('to_uk') || route.routeKey === 'families_to_uk'
      ? 'United Kingdom'
      : route.routeKey === 'uk_to_dubai'
        ? 'United Arab Emirates'
        : route.routeKey === 'leaving_uk'
          ? ''
          : '';

  const [values, setValues] = useState<Record<string, string>>(() => ({
    originCountry: defaultOrigin,
    destinationCountry: defaultDestination,
    destinationCity: route.routeKey === 'uk_to_dubai' ? 'Dubai' : '',
    householdType: 'alone',
    visaStatus: 'not_started',
    housingStatus: 'not_started',
    accommodationStatus: 'not_started',
    bankingStatus: 'not_started',
    primaryApplicantVisaStatus: 'not_started',
    destinationVisaStatus: 'not_started',
    casStatus: 'not_started',
  }));

  function setField(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function validateStep(index: number): string | null {
    for (const field of steps[index].fields) {
      if (field.required && !values[field.key]?.trim()) {
        return `${field.label} is required`;
      }
      if (field.type === 'email' && values[field.key]) {
        const email = values[field.key].trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return 'Enter a valid email address';
        }
      }
    }
    return null;
  }

  function goNext() {
    const validationError = validateStep(stepIndex);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSlideDirection('forward');
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function goBack() {
    setError(null);
    setSlideDirection('back');
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationError = validateStep(stepIndex);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    const answers: Record<string, string> = {};
    for (const step of steps) {
      for (const field of step.fields) {
        const val = values[field.key]?.trim();
        if (val) answers[field.key] = val;
      }
    }

    try {
      const result = await submitCheck({
        routeKey: route.routeKey,
        answers,
      });

      router.push(`/check/result/${result.caseId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  const stepCount = steps.length;
  const isLastStep = stepIndex === stepCount - 1;

  if (stepCount === 0) {
    return (
      <div className="container-page section mx-auto max-w-2xl text-on-surface-variant">
        No intake fields configured for this route.
      </div>
    );
  }

  return (
    <div className="container-page section mx-auto max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">{route.title}</p>
      <h1 className="mt-2 text-3xl font-bold text-on-surface">Your free {FREE_PRODUCT_NAME}</h1>
      <p className="mt-3 text-on-surface-variant">{CHECK_INTRO}</p>

      {showUpgradeNote && (
        <div className="mt-6 rounded-xl border border-primary/20 bg-primary-fixed/40 p-4 text-sm text-on-primary-fixed-variant">
          Complete your Lifeport Check first, then {LIVING_CTA.toLowerCase()} from your report page.
        </div>
      )}

      <div className="mt-8">
        <div className="flex items-center gap-2">
          {steps.map((step, index) => {
            const active = index === stepIndex;
            const done = index < stepIndex;
            return (
              <div key={step.step.key} className="flex flex-1 items-center gap-2">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                        active
                          ? 'bg-primary text-on-primary'
                          : done
                            ? 'bg-primary-container text-on-primary-container'
                            : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {done ? '✓' : index + 1}
                    </span>
                    <span
                      className={`truncate text-sm font-medium ${
                        active ? 'text-on-surface' : 'text-on-surface-variant'
                      }`}
                    >
                      {step.step.title}
                    </span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-outline-variant/25">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        done || active ? 'bg-primary' : 'bg-transparent'
                      }`}
                      style={{ width: done ? '100%' : active ? '50%' : '0%' }}
                    />
                  </div>
                </div>
                {index < steps.length - 1 ? (
                  <div className="hidden h-px w-3 shrink-0 bg-outline-variant/30 sm:block" />
                ) : null}
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-on-surface-variant">
          Step {stepIndex + 1} of {steps.length}
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-6">
        <div
          key={`${currentStep.step.key}-${stepIndex}`}
          className={
            slideDirection === 'forward' ? 'intake-step-enter-forward' : 'intake-step-enter-back'
          }
        >
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 report-soft-shadow">
            <div className="flex items-start gap-1">
              <h2 className="text-xl font-semibold text-on-surface">{currentStep.step.title}</h2>
              {checkStepGuidance(currentStep.step.key) ? (
                <FieldInfoTip
                  text={checkStepGuidance(currentStep.step.key)!}
                  label={currentStep.step.title}
                  heading="What to fill in"
                  wide
                  placement="below"
                  size="md"
                />
              ) : null}
            </div>
            <p className="mt-1 text-sm text-on-surface-variant">{currentStep.step.subtitle}</p>
            <div className="mt-6 space-y-5">
              {currentStep.fields.map((field) => (
                <IntakeField
                  key={field.key}
                  field={field}
                  defaultValue={values[field.key]}
                  onChange={(value) => setField(field.key, value)}
                />
              ))}
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-5 rounded-lg bg-error-container px-4 py-3 text-sm text-on-error-container">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-outline-variant/20 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={submitting || stepIndex === 0}
            className="min-w-[7.5rem]"
          >
            Previous
          </Button>

          {isLastStep ? (
            <Button type="submit" disabled={submitting} className="min-w-[7.5rem]">
              {submitting ? 'Checking your move…' : CHECK_CTA}
            </Button>
          ) : (
            <Button type="button" onClick={goNext} disabled={submitting} className="min-w-[7.5rem]">
              Next
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
