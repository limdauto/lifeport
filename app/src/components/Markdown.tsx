import { renderSimpleMarkdown } from '@/lib/markdown';

export function Markdown({ content }: { content: string }) {
  return (
    <div
      className="prose-lifeport space-y-3 text-on-surface-variant leading-relaxed"
      dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(content) }}
    />
  );
}
