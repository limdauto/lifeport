'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import type { Id } from 'convex/_generated/dataModel';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { Markdown } from '@/components/Markdown';
import { RiskBadge } from '@/components/RiskBadge';
import { Button } from '@/components/marketing/Button';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { PAID_PRODUCT_NAME } from '@/lib/copy';

export function AdminCaseDetail({ caseId }: { caseId: Id<'cases'> }) {
  const data = useQuery(api.admin.getCaseAdminDetail, { caseId });
  const updateSection = useMutation(api.admin.updateLivingSection);
  const publishReport = useMutation(api.admin.publishLivingReport);
  const addNote = useMutation(api.admin.addAdminNote);

  const [noteBody, setNoteBody] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (data === undefined) {
    return <p className="text-on-surface-variant">Loading case…</p>;
  }
  if (!data) {
    return <p className="text-on-surface-variant">Case not found.</p>;
  }

  const { case: caseDoc, route, profile, livingReport, livingSections, packages, jobs, notes } =
    data;
  const canPublish =
    livingReport &&
    (livingReport.status === 'needs_review' || livingReport.status === 'ready');

  async function onPublish() {
    if (!livingReport) return;
    setPublishing(true);
    setMessage(null);
    try {
      const result = await publishReport({
        caseId,
        reportId: livingReport._id,
      });
      setMessage(`Published ${result.sectionCount} sections to customer.`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Publish failed');
    } finally {
      setPublishing(false);
    }
  }

  async function onAddNote(e: FormEvent) {
    e.preventDefault();
    if (!noteBody.trim()) return;
    try {
      await addNote({
        caseId,
        reportId: livingReport?._id,
        body: noteBody,
      });
      setNoteBody('');
      setMessage('Note saved.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Could not save note');
    }
  }

  return (
    <div>
      <Link href="/admin/cases" className="text-sm text-primary hover:underline">
        ← All cases
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">{caseDoc.name}</h1>
          <p className="mt-1 text-on-surface-variant">
            {caseDoc.email} · {route?.title ?? caseDoc.routeKey}
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Case <code className="text-xs">{caseId}</code> · Profile v{profile?.version ?? 1}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" href={`/report/${caseId}`}>
            Customer view
          </Button>
          {canPublish ? (
            <Button size="sm" disabled={publishing} onClick={onPublish}>
              {publishing ? 'Publishing…' : `Publish ${PAID_PRODUCT_NAME}`}
            </Button>
          ) : null}
        </div>
      </div>

      {message ? (
        <p className="mt-4 rounded-lg bg-surface-container-high px-4 py-3 text-sm text-on-surface-variant">
          {message}
        </p>
      ) : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-on-surface">{PAID_PRODUCT_NAME}</h2>
            {!livingReport ? (
              <p className="mt-2 text-sm text-on-surface-variant">No {PAID_PRODUCT_NAME} yet.</p>
            ) : (
              <>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-on-surface-variant">
                  <StatusBadge kind="report" status={livingReport.status} />
                  <span>
                    · {livingSections.length} sections
                  </span>
                </p>
                <div className="mt-4 space-y-6">
                  {livingSections.map((section) => (
                    <SectionEditor
                      key={section._id}
                      section={section}
                      onSave={async (content) => {
                        await updateSection({
                          sectionId: section._id,
                          contentMarkdown: content,
                        });
                        setMessage(`Saved ${section.title}.`);
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-xl border border-outline-variant/40 p-4">
            <h3 className="font-semibold text-on-surface">Packages</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {packages.length === 0 ? (
                <li className="text-on-surface-variant">None</li>
              ) : (
                packages.map((pkg) => (
                  <li key={pkg._id} className="text-on-surface-variant">
                    <span className="font-medium text-on-surface">{pkg.title}</span>
                    <span className="ml-2">
                      <StatusBadge kind="package" status={pkg.status} />
                    </span>
                  </li>
                ))
              )}
            </ul>
          </section>

          <section className="rounded-xl border border-outline-variant/40 p-4">
            <h3 className="font-semibold text-on-surface">Admin notes</h3>
            <form onSubmit={onAddNote} className="mt-3 space-y-2">
              <textarea
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
                rows={3}
                placeholder="Internal note for this case…"
                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none ring-primary focus:ring-2"
              />
              <Button type="submit" size="sm" variant="outline">
                Add note
              </Button>
            </form>
            <ul className="mt-4 space-y-3 text-sm">
              {notes.map((note) => (
                <li key={note._id} className="border-t border-outline-variant/30 pt-3">
                  <p className="text-on-surface">{note.body}</p>
                  <p className="mt-1 text-xs text-on-surface-variant">
                    {note.author} · {new Date(note.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-outline-variant/40 p-4">
            <h3 className="font-semibold text-on-surface">Generation jobs</h3>
            <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto text-xs">
              {jobs.map((job) => (
                <li key={job._id} className="text-on-surface-variant">
                  <StatusBadge kind="job" status={job.status} jobType={job.type} />
                  {job.error ? (
                    <span className="block text-error">{job.error}</span>
                  ) : null}
                  <span className="block">{new Date(job.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

function SectionEditor({
  section,
  onSave,
}: {
  section: {
    _id: Id<'reportSections'>;
    sectionKey: string;
    title: string;
    contentMarkdown: string;
    riskLevel?: string;
    status: string;
  };
  onSave: (content: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(section.contentMarkdown);
  const [saving, setSaving] = useState(false);

  return (
    <article className="rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-on-surface">{section.title}</h3>
        <div className="flex items-center gap-2">
          <StatusBadge kind="section" status={section.status} />
          {section.riskLevel ? <RiskBadge level={section.riskLevel} /> : null}
        </div>
      </div>

      {editing ? (
        <div className="mt-4 space-y-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={10}
            className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 font-mono text-sm text-on-surface outline-none ring-primary focus:ring-2"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                try {
                  await onSave(draft);
                  setEditing(false);
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? 'Saving…' : 'Save section'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setDraft(section.contentMarkdown);
                setEditing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-3 text-sm">
            <Markdown content={section.contentMarkdown} />
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            Edit markdown
          </button>
        </>
      )}
    </article>
  );
}
