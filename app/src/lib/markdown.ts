export function renderSimpleMarkdown(markdown: string): string {
  const escaped = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  const lines = withBold.split('\n');
  const html: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inList) {
        html.push('</ul>');
        inList = false;
      }
      continue;
    }

    if (trimmed.startsWith('- ')) {
      if (!inList) {
        html.push('<ul class="list-disc pl-5 space-y-1">');
        inList = true;
      }
      html.push(`<li>${trimmed.slice(2)}</li>`);
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) {
        html.push('<ol class="list-decimal pl-5 space-y-1">');
        inList = true;
      }
      html.push(`<li>${trimmed.replace(/^\d+\.\s/, '')}</li>`);
      continue;
    }

    if (inList) {
      html.push('</ul>');
      inList = false;
    }

    if (trimmed.startsWith('<strong>') || trimmed.includes('<strong>')) {
      html.push(`<p>${trimmed}</p>`);
    } else if (trimmed.startsWith('*') && trimmed.endsWith('*')) {
      html.push(`<p class="text-on-surface-variant italic">${trimmed.slice(1, -1)}</p>`);
    } else {
      html.push(`<p>${trimmed}</p>`);
    }
  }

  if (inList) html.push('</ul>');

  return html.join('');
}
