/** Parse Lifeport report markdown into structured blocks for rich UI. */

export type ContentBlock =
  | { type: 'paragraph'; html: string }
  | { type: 'italic'; html: string }
  | { type: 'heading'; html: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'warning'; html: string }
  | { type: 'key_line'; label: string; html: string }
  | { type: 'chain'; title?: string; steps: Array<{ label: string; detail: string }> }
  | { type: 'table'; headers: string[]; rows: string[][] };

function inlineFormat(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function isTableRow(line: string): boolean {
  const t = line.trim();
  return t.startsWith('|') && t.endsWith('|') && t.split('|').length >= 3;
}

function isTableDivider(line: string): boolean {
  return /^\|[\s\-:|]+\|$/.test(line.trim());
}

function parseTableRow(line: string): string[] {
  return line
    .trim()
    .slice(1, -1)
    .split('|')
    .map((c) => c.trim());
}

function parseChainStep(line: string): { label: string; detail: string } | null {
  const m = line.match(/^\d+\.\s+\*\*(.+?)\*\*\s*[—–-]?\s*(.*)$/);
  if (m) return { label: m[1], detail: m[2] };
  const plain = line.match(/^\d+\.\s+(.+)$/);
  if (plain) return { label: plain[1], detail: '' };
  return null;
}

export function parseReportContent(markdown: string): ContentBlock[] {
  const lines = markdown.split('\n');
  const blocks: ContentBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    if (trimmed.startsWith('⚠️') || trimmed.startsWith('⚠')) {
      blocks.push({ type: 'warning', html: inlineFormat(trimmed.replace(/^⚠️?\s*/, '')) });
      i++;
      continue;
    }

    if (isTableRow(trimmed) && i + 1 < lines.length && isTableDivider(lines[i + 1].trim())) {
      const headers = parseTableRow(trimmed);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && isTableRow(lines[i].trim())) {
        rows.push(parseTableRow(lines[i].trim()));
        i++;
      }
      blocks.push({ type: 'table', headers, rows });
      continue;
    }

    const keyLine = trimmed.match(/^\*\*(.+?)\*\*\s*[：:]\s*(.+)$/);
    if (keyLine) {
      blocks.push({
        type: 'key_line',
        label: keyLine[1],
        html: inlineFormat(keyLine[2]),
      });
      i++;
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const start = i;
      const steps: Array<{ label: string; detail: string }> = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        const step = parseChainStep(lines[i].trim());
        if (step) steps.push(step);
        i++;
      }
      const looksLikeChain = steps.length >= 2 && steps.some((s) => s.detail.length > 0);
      if (looksLikeChain) {
        let title: string | undefined;
        const prev = blocks[blocks.length - 1];
        if (prev?.type === 'heading') {
          title = prev.html.replace(/<[^>]+>/g, '');
          blocks.pop();
        }
        blocks.push({ type: 'chain', title, steps });
        continue;
      }
      i = start;
    }

    if (trimmed.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(inlineFormat(lines[i].trim().slice(2)));
        i++;
      }
      blocks.push({ type: 'list', ordered: false, items });
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(inlineFormat(lines[i].trim().replace(/^\d+\.\s/, '')));
        i++;
      }
      blocks.push({ type: 'list', ordered: true, items });
      continue;
    }

    if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.startsWith('**')) {
      blocks.push({ type: 'italic', html: inlineFormat(trimmed.slice(1, -1)) });
      i++;
      continue;
    }

    if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes(':')) {
      blocks.push({ type: 'heading', html: inlineFormat(trimmed) });
      i++;
      continue;
    }

    blocks.push({ type: 'paragraph', html: inlineFormat(trimmed) });
    i++;
  }

  return blocks;
}

export function extractWarnings(markdown: string): string[] {
  return markdown
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('⚠'))
    .map((l) => l.replace(/^⚠️?\s*/, '').replace(/\*\*/g, ''));
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical' | 'unknown';

export function riskRank(level?: string): number {
  const ranks: Record<string, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
    unknown: 0,
  };
  return ranks[level ?? 'unknown'] ?? 0;
}
