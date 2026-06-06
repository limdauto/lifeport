const riskItems = [
  { label: 'Tax Residency Transition', level: 'critical', bar: 'bg-error-container' },
  { label: 'Spouse Visa Processing', level: 'high', bar: 'bg-amber-100' },
  { label: 'Nursery Registration', level: 'high', bar: 'bg-amber-100' },
  { label: 'Bank Account Setup', level: 'low', bar: 'bg-surface-container' },
];

const levelStyles: Record<string, string> = {
  critical: 'bg-error-container text-on-error-container',
  high: 'bg-amber-200 text-amber-900',
  low: 'bg-surface-container-high text-on-surface-variant',
};

const levelLabels: Record<string, string> = {
  critical: 'Critical',
  high: 'High',
  low: 'Low',
};

const timeline = [
  {
    month: 'Month 1',
    status: 'active' as const,
    statusLabel: 'In progress',
    tasks: [
      { label: 'Visa Applications', done: true },
      { label: 'Document Apostille', done: false },
    ],
  },
  {
    month: 'Month 2',
    status: 'upcoming' as const,
    statusLabel: 'Upcoming',
    tasks: [
      { label: 'Tax Structuring', done: false },
      { label: 'Bank Account Setup', done: false },
    ],
  },
  {
    month: 'Month 3',
    status: 'upcoming' as const,
    statusLabel: 'Upcoming',
    tasks: [
      { label: 'Housing & Schooling', done: false },
      { label: 'Tax Registration', done: false },
    ],
  },
];

export function DashboardPreview() {
  return (
    <div className="dashboard-window">
      <div className="flex items-center justify-between border-b border-outline-variant/50 bg-surface-container-high px-6 py-4">
        <span className="text-label-md font-semibold text-on-surface">Lifeport Plan — sample pages</span>
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-outline-variant/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-outline-variant/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-outline-variant/60" />
        </div>
      </div>

      <div className="dashboard-window-body">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="mb-5 flex items-baseline justify-between">
              <h4 className="text-label-md font-semibold text-on-surface">Risk Map</h4>
              <span className="text-label-sm text-outline">Updated today</span>
            </div>
            <ul className="space-y-3">
              {riskItems.map((item) => (
                <li
                  key={item.label}
                  className={`flex items-center justify-between rounded-DEFAULT px-4 py-3.5 ${item.bar}`}
                >
                  <span className="text-body-md font-medium text-on-surface">{item.label}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-label-sm font-semibold uppercase tracking-wide ${levelStyles[item.level]}`}
                  >
                    {levelLabels[item.level]}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-surface-container-low/60 p-5">
            <div className="mb-5 flex items-baseline justify-between">
              <h4 className="text-label-md font-semibold text-on-surface">Timeline</h4>
              <span className="text-label-sm text-outline">3-month view</span>
            </div>

            <div className="dashboard-timeline">
              <div className="dashboard-timeline-track" aria-hidden />
              {timeline.map((entry) => (
                <div key={entry.month} className="dashboard-timeline-entry">
                  <div
                    className={`dashboard-timeline-node ${entry.status === 'active' ? 'dashboard-timeline-node--active' : 'dashboard-timeline-node--upcoming'}`}
                    aria-hidden
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-label-md font-semibold text-on-surface">{entry.month}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-label-sm font-medium ${entry.status === 'active' ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-surface-container text-on-surface-variant'}`}
                    >
                      {entry.statusLabel}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {entry.tasks.map((task) => (
                      <li
                        key={task.label}
                        className={`dashboard-timeline-task ${task.done ? 'dashboard-timeline-task--done' : ''}`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${task.done ? 'bg-primary text-on-primary' : 'border border-outline-variant text-outline'}`}
                          aria-hidden
                        >
                          {task.done ? '✓' : ''}
                        </span>
                        <span className={task.done ? 'font-medium text-on-surface' : ''}>
                          {task.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
