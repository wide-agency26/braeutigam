import Link from "next/link";
import { notFound } from "next/navigation";
import { updateApplicationStatus } from "@/app/actions/applications";
import { getApplicationById } from "@/lib/data/applications";
import { APPLICATION_STATUS_LABEL, formatDateTime } from "@/lib/format";
import type { ApplicationStatus } from "@prisma/client";

type PageProps = {
  params: Promise<{ id: string }>;
};

const STATUSES = Object.keys(APPLICATION_STATUS_LABEL) as ApplicationStatus[];

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const application = await getApplicationById(id);
  if (!application) notFound();

  return (
    <>
      <header className="desk-head">
        <div>
          <h1>
            {application.firstName} {application.lastName}
          </h1>
          <p className="desk-lede">
            Applied for {application.job.title} on{" "}
            {formatDateTime(application.createdAt)}.
          </p>
        </div>
        <Link className="desk-link" href={`/cms/admin/jobs/${application.jobId}`}>
          Edit this job
        </Link>
      </header>

      <section className="desk-detail">
        <div className="desk-panel">
          <dl>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${application.email}`}>{application.email}</a>
            </dd>
            <dt>Phone</dt>
            <dd>{application.phone || "Not given"}</dd>
            <dt>Resume</dt>
            <dd>
              {application.resumePath ? (
                <a href={`/cms/admin/applications/${application.id}/resume`}>
                  {application.resumeName ?? "Download resume"}
                </a>
              ) : (
                "None on file"
              )}
            </dd>
          </dl>
        </div>

        <form action={updateApplicationStatus} className="desk-actions">
          <input type="hidden" name="id" value={application.id} />
          <label className="desk-field">
            <span>Application status</span>
            <select
              className="desk-input"
              name="status"
              defaultValue={application.status}
            >
              {STATUSES.map((value) => (
                <option key={value} value={value}>
                  {APPLICATION_STATUS_LABEL[value]}
                </option>
              ))}
            </select>
          </label>
          <button className="desk-btn desk-btn-primary" type="submit">
            Save status
          </button>
        </form>

        {application.coverLetter ? (
          <div className="desk-panel">
            <h2>Cover letter</h2>
            <p className="desk-pre">{application.coverLetter}</p>
          </div>
        ) : (
          <p className="desk-empty">No cover letter was included.</p>
        )}
      </section>
    </>
  );
}
