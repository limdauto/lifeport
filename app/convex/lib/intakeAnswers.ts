import { fieldsForSection } from './sectionDependencies';

export const DONT_KNOW_VALUE = 'dont_know';

export function isDontKnow(value?: string): boolean {
  return value === DONT_KNOW_VALUE;
}

export function formatProfileAnswer(value?: string): string {
  if (!value) return 'Not provided';
  if (isDontKnow(value)) return "Don't know yet";
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function fieldLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/Uae/g, 'UAE')
    .replace(/Uk/g, 'UK')
    .replace(/Ejari/g, 'Ejari')
    .replace(/Dewa/g, 'DEWA')
    .replace(/Isa/g, 'ISA')
    .replace(/Ihs/g, 'IHS')
    .replace(/Cas/g, 'CAS')
    .trim();
}

export function dontKnowSectionNote(
  sectionKey: string,
  answers: Record<string, string | undefined>,
): string {
  const unknown = fieldsForSection(sectionKey).filter((k) => isDontKnow(answers[k]));
  if (unknown.length === 0) return '';

  const labels = unknown.map(fieldLabel);
  return `\n\n---\n\n**Still to confirm:** ${labels.map((l) => `**${l}**`).join(' · ')}. You marked these as *don't know yet* — Lifeport will keep guidance here until you update **Inputs**.`;
}

export function countDontKnowAnswers(answers: Record<string, string | undefined>): number {
  return Object.values(answers).filter(isDontKnow).length;
}
