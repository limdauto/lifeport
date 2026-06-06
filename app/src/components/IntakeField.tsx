import type { FieldDef } from '@/lib/fieldDefs';

const inputClass =
  'mt-1.5 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-on-surface outline-none ring-primary focus:ring-2';

export function IntakeField({
  field,
  defaultValue,
  onChange,
}: {
  field: FieldDef;
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const common = {
    name: field.key,
    defaultValue,
    placeholder: field.placeholder,
    onChange: onChange
      ? (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
          onChange(e.target.value)
      : undefined,
  };

  return (
    <label className="block">
      <span className="text-sm font-medium text-on-surface">
        {field.label}
        {field.required ? <span className="text-error"> *</span> : null}
      </span>
      {field.type === 'textarea' ? (
        <textarea {...common} rows={3} className={inputClass} />
      ) : field.type === 'select' ? (
        <select {...common} className={inputClass}>
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
      {field.hint ? (
        <p className="mt-1 text-xs text-on-surface-variant">{field.hint}</p>
      ) : null}
    </label>
  );
}
