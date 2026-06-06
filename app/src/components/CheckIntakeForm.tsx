'use client';

import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { api } from 'convex/_generated/api';
import { Button } from '@/components/marketing/Button';
import { CHECK_CTA, CHECK_INTRO, FREE_PRODUCT_NAME, LIVING_CTA } from '@/lib/copy';
import { checkFieldsForRoute, type FieldDef } from '@/lib/fieldDefs';
import type { RouteConfig } from '@/lib/routes';

type Props = {
  route: RouteConfig;
  showUpgradeNote?: boolean;
};

export function CheckIntakeForm({ route, showUpgradeNote }: Props) {
  const router = useRouter();
  const submitCheck = useMutation(api.intake.submitCheck);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fields = useMemo(() => checkFieldsForRoute(route.checkFields), [route.checkFields]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const answers: Record<string, string> = {};
    for (const field of fields) {
      const val = String(form.get(field.key) ?? '').trim();
      if (val) answers[field.key] = val;
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

  const defaultOrigin = route.routeKey === 'uk_to_dubai' || route.routeKey === 'leaving_uk' ? 'United Kingdom' : '';
  const defaultDestination =
    route.routeKey.includes('to_uk') || route.routeKey === 'families_to_uk'
      ? 'United Kingdom'
      : route.routeKey === 'uk_to_dubai'
        ? 'United Arab Emirates'
        : route.routeKey === 'leaving_uk'
          ? ''
          : '';

  const defaults: Record<string, string> = {
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
  };

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

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        {fields.map((field) => (
          <IntakeField key={field.key} field={field} defaultValue={defaults[field.key]} />
        ))}

        {error && (
          <p className="rounded-lg bg-error-container px-4 py-3 text-sm text-on-error-container">
            {error}
          </p>
        )}

        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? 'Checking your move…' : CHECK_CTA}
        </Button>
      </form>
    </div>
  );
}

function IntakeField({ field, defaultValue }: { field: FieldDef; defaultValue?: string }) {
  const inputClass =
    'mt-1.5 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-on-surface outline-none ring-primary focus:ring-2';

  return (
    <label className="block">
      <span className="text-sm font-medium text-on-surface">{field.label}</span>
      {field.type === 'textarea' ? (
        <textarea
          name={field.key}
          required={field.required}
          defaultValue={defaultValue}
          placeholder={field.placeholder}
          rows={3}
          className={inputClass}
        />
      ) : field.type === 'select' && field.options ? (
        <select name={field.key} required={field.required} defaultValue={defaultValue} className={inputClass}>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={field.key}
          type={field.type === 'email' ? 'email' : field.type}
          required={field.required}
          defaultValue={defaultValue}
          placeholder={field.placeholder}
          className={inputClass}
        />
      )}
    </label>
  );
}
