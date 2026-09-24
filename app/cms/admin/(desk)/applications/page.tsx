import Link from "next/link";
import type { ApplicationStatus } from "@prisma/client";
import { StatusLabel } from "@/app/cms/admin/StatusLabel";
import { listApplications } from "@/lib/data/applications";
import { listJobs } from "@/lib/data/jobs";
import { APPLICATION_STATUS_LABEL, formatDateTime } from "@/lib/format";

const STATUSES: ApplicationStatus[] = [
  "NEW",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "HIRED",
];

type PageProps = {
  searchParams: Promise<{ job?: string; status?: string }>;
};

export default async function ApplicationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const jobId = params.job || undefined;
  const status = STATUSES.includes(params.status as ApplicationStatus)
    ? (params.status as ApplicationStatus)
    : undefined;

  const [rows, jobs] = await Promise.all([
    listApplications({ jobId, status }),
    listJobs(),
  ]);

  return (
    <>
      <header className="desk-head">
        <div>
          <h1>Applicants</h1>
          <p className="desk-lede">
            Everyone who applied through the careers page. Open a name to read
            the application and change its status.
          </p>
        </div>
      </header>

      <form className="desk-actions" method="get">
        <label className="desk-field">
          <span>Job</span>
          <select className="desk-input" name="job" defaultValue={jobId ?? ""}>
            <option value="">All jobs</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </label>
        <label className="desk-field">
          <span>Status</span>
          <select className="desk-input" name="status" defaultValue={status ?? ""}>
            <option value="">All statuses</option>
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {APPLICATION_STATUS_LABEL[value]}
              </option>
            ))}
          </select>
        </label>
        <button className="desk-btn" type="submit">
          Filter
        </button>
      </form>

      {rows.length === 0 ? (
        <p className="desk-empty">No applications match this filter.</p>
      ) : (
        <div className="desk-table-wrap">
          <table className="desk-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Job</th>
                <th>Status</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <Link href={`/cms/admin/applications/${row.id}`}>
                      {row.firstName} {row.lastName}
                    </Link>
                  </td>
                  <td>{row.job.title}</td>
                  <td>
                    <StatusLabel code={row.status}>
                      {APPLICATION_STATUS_LABEL[row.status]}
                    </StatusLabel>
                  </td>
                  <td>{formatDateTime(row.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
