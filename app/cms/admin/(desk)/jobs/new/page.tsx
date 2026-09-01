import { createJob } from "@/app/actions/jobs";
import { JobForm } from "../JobForm";

export default function NewJobPage() {
  return (
    <>
      <header className="desk-head">
        <div>
          <h1>New job</h1>
          <p className="desk-lede">
            Save as a draft, or set status to Published to show it on the careers
            page.
          </p>
        </div>
      </header>
      <JobForm action={createJob} submitLabel="Save job" />
    </>
  );
}
