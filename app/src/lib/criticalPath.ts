export type CriticalPathStep = {
  label: string;
  subSteps?: string[];
};

export type CriticalPathData = {
  routeTitle: string;
  steps: CriticalPathStep[];
};

/** Parse `**UK to Dubai critical path:** A → B → C` from report markdown. */
export function parseCriticalPath(markdown: string): CriticalPathData | null {
  const line = markdown
    .split('\n')
    .map((l) => l.trim())
    .find((l) => /critical path:/i.test(l));
  if (!line) return null;

  const match = line.match(/\*\*(.+?) critical path:\*\*\s*(.+)$/i);
  if (!match) return null;

  const routeTitle = match[1].trim();
  const pathStr = match[2].trim();
  if (!pathStr) return null;

  const steps = pathStr.split(/\s*→\s*/).map((part) => {
    const nested = part.match(/^(.+?)\s*\((.+)\)$/);
    if (nested) {
      return {
        label: nested[1].trim(),
        subSteps: nested[2].split(/\s*→\s*/).map((s) => s.trim()).filter(Boolean),
      };
    }
    return { label: part.trim() };
  });

  if (steps.length === 0) return null;
  return { routeTitle, steps };
}

export function markdownWithoutCriticalPath(markdown: string): string {
  return markdown
    .split('\n')
    .filter((l) => !/critical path:/i.test(l.trim()))
    .join('\n')
    .trim();
}
