import Link from "next/link";
import { upcomingCvDeletions } from "@/lib/data/retention";
import { formatDateTime } from "@/lib/format";

export default async function RetentionPage() {
  const { count, applications } = await upcomingCvDeletions();
  return <>
    <header className="desk-head"><div><h1>CV retention</h1>
      <p className="desk-lede">CVs are automatically removed after 30 days. Applications and recruitment statuses stay in the CMS.</p>
    </div></header>
    <div className="desk-notice"><p>Advance notice appears here and on Overview seven days before expiry. The daily task removes expired files; failed deletions are retried. A CV already overdue when the task first runs gets at least one day of notice.</p></div>
    <h2>{count} CV{count === 1 ? "" : "s"} due within seven days or overdue</h2>
    {applications.length ? <div className="desk-table-wrap"><table className="desk-table">
      <thead><tr><th>Applicant</th><th>Job</th><th>CV expires</th><th>Removal</th></tr></thead>
      <tbody>{applications.map(row => <tr key={row.id}>
        <td><Link href={`/cms/admin/applications/${row.id}`}>{row.firstName} {row.lastName}</Link></td>
        <td>{row.job.title}</td><td>{row.retainUntil ? formatDateTime(row.retainUntil) : "—"}</td>
        <td>{row.resumeDeletionFailedAt ? "Failed — will retry; file reference retained" : "Scheduled"}</td>
      </tr>)}</tbody></table></div> : <p className="desk-empty">No CVs are due for removal in the next seven days.</p>}
    {count > applications.length ? <p className="desk-hint">Showing the earliest {applications.length} of {count}. All due CVs are processed in scheduled batches.</p> : null}
  </>;
}
