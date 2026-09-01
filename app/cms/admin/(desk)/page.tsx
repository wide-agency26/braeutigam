import Link from "next/link";
import { StatusLabel } from "@/app/cms/admin/StatusLabel";
import { countApplicationsByStatus, recentApplications } from "@/lib/data/applications";
import { countJobsByStatus } from "@/lib/data/jobs";
import { APPLICATION_STATUS_LABEL, formatDateTime } from "@/lib/format";

export default async function AdminHomePage() {
  const [jobCounts, appCounts, recent] = await Promise.all([
    countJobsByStatus(),
    countApplicationsByStatus(),
    recentApplications(8),
  ]);

  return (
    <>
      <header className="desk-head">
        <div>
          <h1>Overview</h1>
          <p className="desk-lede">
            Jobs on the careers page, and the latest people who applied.
          </p>
        </div>
      </header>

      <section className="desk-stats" aria-label="Counts">
        <article>
          <strong>{jobCounts.PUBLISHED}</strong>
          <p>Published jobs</p>
        </article>
        <article>
          <strong>{jobCounts.DRAFT}</strong>
          <p>Drafts</p>
        </article>
        <article>
          <strong>{appCounts.NEW}</strong>
          <p>New applications</p>
        </article>
        <article>
          <strong>{appCounts.REVIEWING + appCounts.SHORTLISTED}</strong>
          <p>In review</p>
        </article>
      </section>

      <section>
        <div className="desk-head">
          <h2>Recent applications</h2>
          <Link className="desk-link" href="/cms/admin/applications">
            All applicants
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="desk-empty">No one has applied yet.</p>
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
                {recent.map((row) => (
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
      </section>
    </>
  );
}
