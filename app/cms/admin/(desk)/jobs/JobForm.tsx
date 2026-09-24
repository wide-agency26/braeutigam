"use client";

import { useActionState } from "react";
import type { EmploymentType, JobStatus } from "@prisma/client";
import { type JobState } from "@/app/actions/jobs";
import { EMPLOYMENT_LABEL, JOB_STATUS_LABEL } from "@/lib/format";

const INITIAL: JobState = {};

type JobValues = {
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  status: JobStatus;
  description: string;
  requirements: string;
};

export function JobForm({
  action,
  job,
  submitLabel,
}: {
  action: (state: JobState | undefined, formData: FormData) => Promise<JobState>;
  job?: JobValues;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const errors = state.fieldErrors;

  return (
    <form action={formAction} className="desk-form">
      {state.error ? <p className="desk-banner">{state.error}</p> : null}

      <label className="desk-field">
        <span>Title</span>
        <input
          className="desk-input"
          name="title"
          defaultValue={job?.title}
          required
        />
        {errors?.title ? <p className="desk-error">{errors.title[0]}</p> : null}
      </label>

      <div className="desk-grid-2">
        <label className="desk-field">
          <span>Department</span>
          <input
            className="desk-input"
            name="department"
            defaultValue={job?.department}
            required
          />
          {errors?.department ? (
            <p className="desk-error">{errors.department[0]}</p>
          ) : null}
        </label>
        <label className="desk-field">
          <span>Location</span>
          <input
            className="desk-input"
            name="location"
            defaultValue={job?.location ?? "Germany"}
            required
          />
          {errors?.location ? (
            <p className="desk-error">{errors.location[0]}</p>
          ) : null}
        </label>
      </div>

      <div className="desk-grid-2">
        <label className="desk-field">
          <span>Employment</span>
          <select
            className="desk-input"
            name="employmentType"
            defaultValue={job?.employmentType ?? "FULL_TIME"}
          >
            {(Object.keys(EMPLOYMENT_LABEL) as EmploymentType[]).map((key) => (
              <option key={key} value={key}>
                {EMPLOYMENT_LABEL[key]}
              </option>
            ))}
          </select>
        </label>
        <label className="desk-field">
          <span>Status</span>
          <select
            className="desk-input"
            name="status"
            defaultValue={job?.status ?? "DRAFT"}
          >
            {(Object.keys(JOB_STATUS_LABEL) as JobStatus[]).map((key) => (
              <option key={key} value={key}>
                {JOB_STATUS_LABEL[key]}
              </option>
            ))}
          </select>
          <p className="desk-hint">Published jobs appear on /karriere.</p>
        </label>
      </div>

      <label className="desk-field">
        <span>Description</span>
        <textarea
          className="desk-textarea"
          name="description"
          rows={8}
          defaultValue={job?.description}
          required
        />
        {errors?.description ? (
          <p className="desk-error">{errors.description[0]}</p>
        ) : null}
      </label>

      <label className="desk-field">
        <span>Requirements</span>
        <textarea
          className="desk-textarea"
          name="requirements"
          rows={6}
          defaultValue={job?.requirements}
        />
      </label>

      <button className="desk-btn desk-btn-primary" type="submit" disabled={pending}>
        {pending ? "Saving" : submitLabel}
      </button>
    </form>
  );
}
