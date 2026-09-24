import Link from "next/link";
import { notFound } from "next/navigation";
import { updateJob } from "@/app/actions/jobs";
import { getJobById } from "@/lib/data/jobs";
import { DeleteJobButton } from "../DeleteJobButton";
import { JobForm } from "../JobForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditJobPage({ params }: PageProps) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  const action = updateJob.bind(null, job.id);

  return (
    <>
      <header className="desk-head">
        <div>
          <h1>{job.title}</h1>
          <p className="desk-lede">
            Edit this listing. Published jobs are visible at /karriere.
          </p>
        </div>
        <div className="desk-actions">
          <Link className="desk-link" href={`/karriere/${job.slug}`}>
            View on website
          </Link>
          <Link className="desk-link" href={`/cms/admin/applications?job=${job.id}`}>
            Applicants ({job._count.applications})
          </Link>
          <DeleteJobButton jobId={job.id} title={job.title} />
        </div>
      </header>
      <JobForm action={action} job={job} submitLabel="Save job" />
    </>
  );
}
