import Link from "next/link";
import { StatusLabel } from "@/app/cms/admin/StatusLabel";
import { listJobs } from "@/lib/data/jobs";
import {
  EMPLOYMENT_LABEL,
  JOB_STATUS_LABEL,
  formatDate,
  formatDepartment,
} from "@/lib/format";

export default async function JobsPage() {
  const jobs = await listJobs();

  return (
    <>
      <header className="desk-head">
        <div>
          <h1>Jobs</h1>
          <p className="desk-lede">
            Listings with status Published appear on the public careers page.
          </p>
        </div>
        <Link className="desk-btn desk-btn-primary" href="/cms/admin/jobs/new">
          New job
        </Link>
      </header>

      {jobs.length === 0 ? (
        <p className="desk-empty">No jobs yet. Create the first listing.</p>
      ) : (
        <div className="desk-table-wrap">
          <table className="desk-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Department</th>
                <th>Type</th>
                <th>Status</th>
                <th>Applicants</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <Link href={`/cms/admin/jobs/${job.id}`}>{job.title}</Link>
                  </td>
                  <td>{formatDepartment(job.department)}</td>
                  <td>{EMPLOYMENT_LABEL[job.employmentType]}</td>
                  <td>
                    <StatusLabel code={job.status}>
                      {JOB_STATUS_LABEL[job.status]}
                    </StatusLabel>
                  </td>
                  <td>
                    <Link href={`/cms/admin/applications?job=${job.id}`}>
                      {job._count.applications}
                    </Link>
                  </td>
                  <td>{formatDate(job.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
