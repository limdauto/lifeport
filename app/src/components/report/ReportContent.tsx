import type { ContentBlock } from '@/lib/parseReportContent';
import { inferDomain, DOMAIN_META } from '@/lib/reportDesign';
import { ReportIcon } from '@/components/report/ReportIcon';

function Html({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export function ReportContent({
  blocks,
  variant = 'default',
}: {
  blocks: ContentBlock[];
  variant?: 'default' | 'editorial';
}) {
  const editorial = variant === 'editorial';

  return (
    <div className={`report-content ${editorial ? 'space-y-6' : 'space-y-4'}`}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'warning':
            return (
              <div
                key={i}
                className="flex gap-3 rounded-2xl border border-error/10 bg-error-container/35 px-5 py-4 text-sm text-on-error-container"
              >
                <ReportIcon name="error" className="shrink-0 text-error" filled size={20} />
                <p>
                  <Html html={block.html} />
                </p>
              </div>
            );
          case 'key_line':
            return (
              <div
                key={i}
                className="flex flex-col gap-1 rounded-xl border border-outline-variant/10 bg-surface px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
              >
                <dt className="shrink-0 text-label-sm font-semibold uppercase tracking-wide text-outline sm:w-36">
                  {block.label}
                </dt>
                <dd className="text-body-md text-on-surface">
                  <Html html={block.html} />
                </dd>
              </div>
            );
          case 'heading':
            return editorial ? (
              <p
                key={i}
                className="text-label-md font-bold uppercase tracking-widest text-error"
              >
                <Html html={block.html.replace(/<[^>]+>/g, '')} />
              </p>
            ) : (
              <p key={i} className="text-sm font-semibold text-on-surface">
                <Html html={block.html} />
              </p>
            );
          case 'italic':
            return (
              <p
                key={i}
                className={`rounded-2xl border border-outline-variant/10 bg-surface-container-low px-5 py-4 text-label-sm italic text-on-surface-variant ${editorial ? '' : ''}`}
              >
                <Html html={block.html} />
              </p>
            );
          case 'paragraph':
            return (
              <p key={i} className="text-body-md leading-relaxed text-on-surface-variant">
                <Html html={block.html} />
              </p>
            );
          case 'list':
            return block.ordered ? (
              <ol key={i} className="space-y-3">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-body-md text-on-surface-variant">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-xs font-bold text-on-surface">
                      {j + 1}
                    </span>
                    <span className="pt-0.5">
                      <Html html={item} />
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="space-y-2">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-2.5 text-body-md text-on-surface-variant">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>
                      <Html html={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case 'chain': {
            return (
              <div key={i} className="report-chain">
                {block.title ? (
                  <p className="mb-6 text-label-md font-bold uppercase tracking-widest text-error">
                    {block.title}
                  </p>
                ) : null}
                <ol className="relative space-y-10 pl-8 before:absolute before:bottom-2 before:left-[15px] before:top-2 before:w-0.5 before:bg-outline-variant/30">
                  {block.steps.map((step, j) => {
                    const domain = inferDomain(`${step.label} ${step.detail}`);
                    const meta = DOMAIN_META[domain];
                    return (
                      <li key={j} className="relative">
                        <div className="absolute -left-[26px] top-1 h-4 w-4 rounded-full border-4 border-surface-container-lowest bg-primary" />
                        <div className="mb-1 flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${meta.colorClass}`}>
                            {meta.label}
                          </span>
                        </div>
                        <h4 className="text-label-md font-medium text-on-surface">{step.label}</h4>
                        {step.detail ? (
                          <p className="mt-1 text-label-sm text-on-surface-variant">{step.detail}</p>
                        ) : null}
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          }
          case 'table':
            return (
              <div key={i} className="overflow-x-auto rounded-2xl border border-outline-variant/20">
                <table className="w-full min-w-[280px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant/30 bg-surface-container-low">
                      {block.headers.map((h, j) => (
                        <th
                          key={j}
                          className="px-4 py-3 text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant"
                        >
                          <Html html={h.replace(/\*\*/g, '')} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, ri) => (
                      <tr
                        key={ri}
                        className="border-b border-outline-variant/15 last:border-0 even:bg-surface-container-low/50"
                      >
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className={`px-4 py-3 text-on-surface-variant ${ci === 0 ? 'font-semibold text-on-surface' : ''}`}
                          >
                            <Html html={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
