import { FieldInfoTip } from '@/components/FieldInfoTip';
import { DONT_KNOW_VALUE, type FieldDef } from '@/lib/fieldDefs';
import { FIELD_GLOSSARY, fieldGlossaryText } from '@/lib/fieldGlossary';

const inputClass =
  'mt-1.5 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-on-surface outline-none ring-primary focus:ring-2 disabled:cursor-not-allowed disabled:bg-surface-container-low disabled:text-on-surface-variant';

export function IntakeField({
  field,
  defaultValue,
  onChange,
}: {
  field: FieldDef;
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const value = onChange ? (defaultValue ?? '') : undefined;
  const isDontKnow = (onChange ? value : defaultValue) === DONT_KNOW_VALUE;
  const glossary = fieldGlossaryText(field.key, field.hint);
  const showDontKnowToggle =
    field.allowDontKnow && field.type !== 'select' && field.type !== 'email';

  function handleDontKnowToggle(checked: boolean) {
    if (!onChange) return;
    onChange(checked ? DONT_KNOW_VALUE : '');
  }

  const common = {
    name: field.key,
    value: onChange ? (isDontKnow ? '' : (value ?? '')) : undefined,
    defaultValue: onChange ? undefined : isDontKnow ? undefined : defaultValue,
    placeholder: isDontKnow ? "Flagged as don't know yet" : field.placeholder,
    required: field.required && !isDontKnow,
    disabled: isDontKnow,
    onChange: onChange
      ? (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
          onChange(e.target.value)
      : undefined,
  };

  return (
    <div className="block">
      <span className="inline-flex items-center text-sm font-medium text-on-surface">
        {field.label}
        {field.required ? <span className="text-error"> *</span> : null}
        {glossary ? <FieldInfoTip text={glossary} label={field.label} /> : null}
      </span>

      {field.type === 'textarea' ? (
        <textarea {...common} rows={3} className={inputClass} />
      ) : field.type === 'select' ? (
        <select
          {...common}
          value={onChange ? (value ?? '') : undefined}
          className={inputClass}
        >
          <option value="">Select…</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input {...common} type={field.type} className={inputClass} />
      )}

      {showDontKnowToggle ? (
        <label className="mt-2.5 flex cursor-pointer items-start gap-2.5 rounded-lg border border-outline-variant/20 bg-surface-container-low/60 px-3 py-2.5 text-sm text-on-surface-variant transition-colors hover:border-primary/20">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
            checked={isDontKnow}
            onChange={(e) => handleDontKnowToggle(e.target.checked)}
          />
          <span>
            <span className="font-medium text-on-surface">Don&apos;t know yet</span>
            <span className="mt-0.5 block text-xs">
              Flag this in your report — Lifeport will include guidance until you fill it in.
            </span>
          </span>
        </label>
      ) : null}

      {field.hint && !(field.key in FIELD_GLOSSARY) && !isDontKnow ? (
        <p className="mt-1 text-xs text-on-surface-variant">{field.hint}</p>
      ) : null}
    </div>
  );
}
