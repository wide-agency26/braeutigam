"use client";

import { deleteJob } from "@/app/actions/jobs";

export function DeleteJobButton({ jobId, title, hasApplicants }: { jobId: string; title: string; hasApplicants: boolean }) {
  return (
    <form
      action={deleteJob}
      onSubmit={(event) => {
        if (!window.confirm(hasApplicants ? `Close “${title}”? All applications and CVs will be retained under the retention policy.` : `Delete “${title}”?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={jobId} />
      <button className="desk-btn desk-btn-danger" type="submit">
        {hasApplicants ? "Close job" : "Delete"}
      </button>
    </form>
  );
}
