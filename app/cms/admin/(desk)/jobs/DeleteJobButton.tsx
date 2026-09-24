"use client";

import { deleteJob } from "@/app/actions/jobs";

export function DeleteJobButton({ jobId, title }: { jobId: string; title: string }) {
  return (
    <form
      action={deleteJob}
      onSubmit={(event) => {
        if (!window.confirm(`Delete “${title}” and every application on it?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={jobId} />
      <button className="desk-btn desk-btn-danger" type="submit">
        Delete
      </button>
    </form>
  );
}
