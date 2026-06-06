import type { ReportDomain } from '@/lib/reportDesign';

export type MoveStatusItem = {
  key: string;
  label: string;
  value: string;
  domain: ReportDomain;
};

function domainForLabel(label: string): ReportDomain {
  const t = label.toLowerCase();
  if (/\b(visa|evisa|ukvi|emirates|cas|sponsor|residence|immigration)\b/.test(t)) return 'visa';
  if (/\b(bank|banking|payroll|money|account)\b/.test(t)) return 'banking';
  if (/\b(tax|hmrc|pension|ni\b|national insurance)\b/.test(t)) return 'tax';
  if (/\b(housing|ejari|tenancy|rent|accommodation|dewa|utility|utilities)\b/.test(t)) {
    return 'housing';
  }
  if (/\b(health|gp|nhs|insurance|medical)\b/.test(t)) return 'health';
  if (/\b(family|school|nursery|child|dependant|spouse)\b/.test(t)) return 'family';
  if (/\b(document|attestation|credential|certificate)\b/.test(t)) return 'documents';
  if (/\b(shipping|storage|pet|transport|phone|sim)\b/.test(t)) return 'logistics';
  return 'general';
}

function parseInlineStatuses(line: string): MoveStatusItem[] {
  const items: MoveStatusItem[] = [];
  const parts = line.split(/·|•|\|/).map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    const bold = part.match(/\*\*(.+?)\*\*[:\s]+(.+)/);
    const plain = part.match(/^([A-Za-z][A-Za-z\s]*?)[:\s]+([a-z_]+)$/i);
    const match = bold ?? plain;
    if (!match) continue;

    const label = match[1].trim();
    const value = match[2].trim();
    if (!label || !value) continue;

    items.push({
      key: label.toLowerCase().replace(/\s+/g, '_'),
      label,
      value,
      domain: domainForLabel(label),
    });
  }

  return items;
}

function parseTableStatuses(markdown: string): MoveStatusItem[] {
  const lines = markdown.split('\n').map((l) => l.trim());
  const items: MoveStatusItem[] = [];

  for (let i = 0; i < lines.length; i++) {
    const row = lines[i];
    if (!row.startsWith('|') || row.includes('---')) continue;

    const cells = row
      .slice(1, -1)
      .split('|')
      .map((c) => c.trim());
    if (cells.length < 2) continue;

    const [colA, colB] = cells;
    const headerish = /^(area|status|domain)$/i.test(colA) || /^(area|status)$/i.test(colB);
    if (headerish) continue;

    const looksLikeStatus = /^(not_started|in_progress|sorted|uncertain|dont_know)$/i.test(colB);
    if (looksLikeStatus) {
      items.push({
        key: colA.toLowerCase().replace(/\s+/g, '_'),
        label: colA,
        value: colB,
        domain: domainForLabel(colA),
      });
    }
  }

  return items;
}

/** Pull Visa / Housing / Banking (etc.) status chips from move summary markdown. */
export function extractMoveStatuses(markdown: string): MoveStatusItem[] {
  const lines = markdown.split('\n').map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    if (
      /visa/i.test(line) &&
      /housing|accommodation/i.test(line) &&
      /banking/i.test(line) &&
      (line.includes('·') || line.includes('•'))
    ) {
      const inline = parseInlineStatuses(line);
      if (inline.length > 0) return inline;
    }
  }

  for (const line of lines) {
    if (/\*\*Visa\*\*/i.test(line) || /\*\*Housing\*\*/i.test(line)) {
      const inline = parseInlineStatuses(line);
      if (inline.length > 0) return inline;
    }
  }

  const fromTable = parseTableStatuses(markdown);
  if (fromTable.length > 0) return fromTable;

  return [];
}

export function parseMoveSummaryContent(markdown: string) {
  const lines = markdown.split('\n').map((l) => l.trim()).filter(Boolean);
  const narrative =
    lines.find((l) => l.includes('planning a move')) ??
    lines.find((l) => /→|is planning|\*\*.+\*\*/.test(l) && !l.includes('Top concern')) ??
    lines[0] ??
    '';
  const concern = lines
    .find((l) => /^\*\*(?:Top|Primary) concern:\*\*/i.test(l))
    ?.replace(/^\*\*(?:Top|Primary) concern:\*\*/i, '')
    .trim();
  const statuses = extractMoveStatuses(markdown);

  return { narrative, concern, statuses };
}
