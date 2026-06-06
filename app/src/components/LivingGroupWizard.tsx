'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { FieldInfoTip, GlossaryTermChip } from '@/components/FieldInfoTip';
import { IntakeField } from '@/components/IntakeField';
import { Button } from '@/components/marketing/Button';
import { ReportIcon } from '@/components/report/ReportIcon';
import { RiskScoreMeter } from '@/components/report/RiskScoreMeter';
import type { FieldDef, LivingFieldGroup } from '@/lib/fieldDefs';
import { groupGuidanceFor, groupTermsFor, LIVING_GROUP_INTROS } from '@/lib/fieldGlossary';
import {
  computeRiskScore,
  sortGroupsByRiskImpact,
  type RouteRiskScoringConfig,
} from '@/lib/riskScore';
import { livingGroupIcon } from '@/lib/reportDesign';

export type LivingWizardGroup = {
  group: LivingFieldGroup;
  label: string;
  fields: FieldDef[];
};

type Props = {
  groups: LivingWizardGroup[];
  initialValues?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void | Promise<void>;
  submitLabel: string;
  submittingLabel?: string;
  submitting?: boolean;
  error?: string | null;
  onFieldChange?: (key: string, value: string) => void;
  onValuesChange?: (values: Record<string, string>) => void;
  footer?: React.ReactNode;
  layout?: 'steps' | 'sidebar';
  showRiskMeter?: boolean;
  riskScoring?: RouteRiskScoringConfig;
};

function groupNavId(group: LivingFieldGroup) {
  return `input-group-${group}`;
}

function GroupSection({
  group,
  label,
  fields,
  values,
  setField,
  showImpact,
  groupImpact,
}: {
  group: LivingFieldGroup;
  label: string;
  fields: FieldDef[];
  values: Record<string, string>;
  setField: (key: string, value: string) => void;
  showImpact?: boolean;
  groupImpact?: number;
}) {
  const groupTerms = groupTermsFor(group);

  return (
    <section
      id={groupNavId(group)}
      className="scroll-mt-32 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 report-soft-shadow"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-container/50 text-primary"
            aria-hidden
          >
            <ReportIcon name={livingGroupIcon(group)} size={20} />
          </div>
          <div className="flex items-start gap-1">
          <h2 className="text-xl font-semibold text-on-surface">{label}</h2>
          <FieldInfoTip
            text={groupGuidanceFor(group)}
            label={label}
            heading="What to fill in"
            wide
            placement="below"
            size="md"
          />
          </div>
        </div>
        {showImpact && groupImpact != null && groupImpact > 0 ? (
          <span className="rounded-full bg-error-container/80 px-3 py-1 text-label-sm font-semibold text-on-error-container">
            +{groupImpact} risk
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
        {LIVING_GROUP_INTROS[group]}
      </p>

      {groupTerms.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {groupTerms.map((term) => (
            <GlossaryTermChip key={term.label} label={term.label} text={term.text} />
          ))}
        </div>
      ) : null}

      <div className="mt-6 space-y-5">
        {fields.map((field) => (
          <IntakeField
            key={field.key}
            field={field}
            defaultValue={values[field.key]}
            onChange={(value) => setField(field.key, value)}
          />
        ))}
      </div>
    </section>
  );
}

export function LivingGroupWizard({
  groups,
  initialValues = {},
  onSubmit,
  submitLabel,
  submittingLabel = 'Saving…',
  submitting = false,
  error,
  onFieldChange,
  onValuesChange,
  footer,
  layout = 'steps',
  showRiskMeter = false,
  riskScoring,
}: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'back'>('forward');
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [activeGroup, setActiveGroup] = useState<LivingFieldGroup | null>(groups[0]?.group ?? null);

  const allFields = useMemo(() => groups.flatMap((g) => g.fields), [groups]);
  const risk = useMemo(
    () => computeRiskScore(values, allFields, riskScoring),
    [values, allFields, riskScoring],
  );

  const navGroups = useMemo(
    () => sortGroupsByRiskImpact(groups, risk.groupImpacts),
    [groups, risk.groupImpacts],
  );

  const stepCount = groups.length;
  const current = groups[stepIndex];
  const isLastStep = stepIndex === stepCount - 1;
  const progress = stepCount > 0 ? Math.round(((stepIndex + 1) / stepCount) * 100) : 0;

  const groupTerms = useMemo(
    () => (current ? groupTermsFor(current.group) : []),
    [current],
  );

  function setField(key: string, value: string) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      onValuesChange?.(next);
      return next;
    });
    onFieldChange?.(key, value);
  }

  function goNext() {
    setSlideDirection('forward');
    setStepIndex((i) => Math.min(i + 1, stepCount - 1));
  }

  function goBack() {
    setSlideDirection('back');
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function jumpToGroup(group: LivingFieldGroup) {
    setActiveGroup(group);
    document.getElementById(groupNavId(group))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  useEffect(() => {
    if (layout !== 'sidebar' || groups.length === 0) return;

    const ids = groups.map((g) => groupNavId(g.group));
    function onScroll() {
      let currentId = ids[0] ?? '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 180) {
          currentId = id;
        }
      }
      const match = groups.find((g) => groupNavId(g.group) === currentId);
      if (match) setActiveGroup(match.group);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [layout, groups]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit(values);
  }

  if (stepCount === 0) {
    return <p className="text-on-surface-variant">No profile fields for this route.</p>;
  }

  if (layout === 'sidebar') {
    return (
      <form onSubmit={handleSubmit} className="mt-8">
        {showRiskMeter ? <RiskScoreMeter result={risk} /> : null}

        <div className={`flex gap-10 lg:gap-12 ${showRiskMeter ? 'mt-8' : ''}`}>
          <aside className="hidden w-56 shrink-0 md:block lg:w-64" aria-label="Profile sections">
            <div className="sticky top-28 space-y-4">
              <p className="pl-2 text-label-sm font-medium uppercase tracking-wider text-on-surface-variant">
                Sections by impact
              </p>
              <nav className="space-y-1">
                {navGroups.map((item, index) => {
                  const icon = livingGroupIcon(item.group);
                  const impact = risk.groupImpacts[item.group] ?? 0;
                  const active = activeGroup === item.group;

                  return (
                    <button
                      key={item.group}
                      type="button"
                      onClick={() => jumpToGroup(item.group)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-label-md transition-all ${
                        active
                          ? 'bg-primary-container text-on-primary-container'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <ReportIcon
                        name={icon}
                        size={20}
                        className={active ? '' : 'text-primary'}
                      />
                      <span className="min-w-0 flex-1 leading-snug">
                        <span className="line-clamp-2">{item.label}</span>
                        {index === 0 && impact > 0 ? (
                          <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-wide text-error">
                            Highest impact
                          </span>
                        ) : null}
                      </span>
                      {impact > 0 ? (
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            active ? 'bg-on-primary-container/15' : 'bg-error-container/60 text-on-error-container'
                          }`}
                        >
                          +{impact}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <div className="min-w-0 flex-1 space-y-10">
            {groups.map((item) => (
              <GroupSection
                key={item.group}
                group={item.group}
                label={item.label}
                fields={item.fields}
                values={values}
                setField={setField}
                showImpact
                groupImpact={risk.groupImpacts[item.group]}
              />
            ))}

            {error ? (
              <p className="rounded-lg bg-error-container px-4 py-3 text-sm text-on-error-container">
                {error}
              </p>
            ) : null}

            {footer}

            <div className="sticky bottom-4 z-10 flex justify-end border-t border-outline-variant/20 bg-surface-container-lowest/95 py-4 backdrop-blur-sm">
              <Button type="submit" disabled={submitting} className="min-w-[10rem]">
                {submitting ? submittingLabel : submitLabel}
              </Button>
            </div>
          </div>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="font-medium text-on-surface">
            Section {stepIndex + 1} of {stepCount}
          </span>
          <span className="text-on-surface-variant">
            {current.fields.length} question{current.fields.length === 1 ? '' : 's'} · optional
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-outline-variant/25">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-on-surface-variant">
          Fill what you know now — you can skip sections and update later in Inputs.
        </p>
      </div>

      <div
        key={`${current.group}-${stepIndex}`}
        className={`mt-6 ${slideDirection === 'forward' ? 'intake-step-enter-forward' : 'intake-step-enter-back'}`}
      >
        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 report-soft-shadow">
          <div className="flex items-start gap-1">
            <h2 className="text-xl font-semibold text-on-surface">{current.label}</h2>
            <FieldInfoTip
              text={groupGuidanceFor(current.group)}
              label={current.label}
              heading="What to fill in"
              wide
              placement="below"
              size="md"
            />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            {LIVING_GROUP_INTROS[current.group]}
          </p>

          {groupTerms.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {groupTerms.map((term) => (
                <GlossaryTermChip key={term.label} label={term.label} text={term.text} />
              ))}
            </div>
          ) : null}

          <div className="mt-6 space-y-5">
            {current.fields.map((field) => (
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

      {error ? (
        <p className="mt-5 rounded-lg bg-error-container px-4 py-3 text-sm text-on-error-container">
          {error}
        </p>
      ) : null}

      {footer}

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
            {submitting ? submittingLabel : submitLabel}
          </Button>
        ) : (
          <Button type="button" onClick={goNext} disabled={submitting} className="min-w-[7.5rem]">
            Next
          </Button>
        )}
      </div>
    </form>
  );
}
