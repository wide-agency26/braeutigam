"use client";

import { useActionState } from "react";
import { applyToJob, type ApplyState } from "@/app/actions/applications";

const INITIAL: ApplyState = {};

export function ApplyForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const action = applyToJob.bind(null, jobId);
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const errors = state.fieldErrors;

  if (state.ok) {
    return (
      <div className="career-card px-5 py-6">
        <p className="career-eyebrow text-[var(--career-neon)]">Received</p>
        <h2 className="mt-4 font-sans text-sm font-bold uppercase tracking-tight">
          Application is on the desk
        </h2>
        <p className="mt-2 font-sans text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
          We logged your file for {jobTitle}. The team reads every application that
          lands here.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="career-card px-5 py-6">
      <p className="career-eyebrow text-[var(--career-neon)]">Apply</p>
      <h2 className="mt-4 font-sans text-sm font-bold uppercase tracking-tight">
        Send your file
      </h2>
      {state.error ? (
        <p className="mt-3 font-sans text-xs text-red-600">{state.error}</p>
      ) : null}

      <label className="mt-5 block">
        <span className="career-eyebrow text-zinc-500">First name</span>
        <input
          className="mt-2 w-full border border-zinc-300 bg-transparent px-3 py-2.5 font-sans text-sm outline-none focus:border-[var(--career-neon)] dark:border-zinc-700"
          name="firstName"
          required
        />
        {errors?.firstName ? (
          <p className="mt-1 font-sans text-xs text-red-600">{errors.firstName[0]}</p>
        ) : null}
      </label>
      <label className="mt-4 block">
        <span className="career-eyebrow text-zinc-500">Last name</span>
        <input
          className="mt-2 w-full border border-zinc-300 bg-transparent px-3 py-2.5 font-sans text-sm outline-none focus:border-[var(--career-neon)] dark:border-zinc-700"
          name="lastName"
          required
        />
        {errors?.lastName ? (
          <p className="mt-1 font-sans text-xs text-red-600">{errors.lastName[0]}</p>
        ) : null}
      </label>
      <label className="mt-4 block">
        <span className="career-eyebrow text-zinc-500">Email</span>
        <input
          className="mt-2 w-full border border-zinc-300 bg-transparent px-3 py-2.5 font-sans text-sm outline-none focus:border-[var(--career-neon)] dark:border-zinc-700"
          type="email"
          name="email"
          required
        />
        {errors?.email ? (
          <p className="mt-1 font-sans text-xs text-red-600">{errors.email[0]}</p>
        ) : null}
      </label>
      <label className="mt-4 block">
        <span className="career-eyebrow text-zinc-500">Phone</span>
        <input
          className="mt-2 w-full border border-zinc-300 bg-transparent px-3 py-2.5 font-sans text-sm outline-none focus:border-[var(--career-neon)] dark:border-zinc-700"
          type="tel"
          name="phone"
        />
      </label>
      <label className="mt-4 block">
        <span className="career-eyebrow text-zinc-500">Cover letter</span>
        <textarea
          className="mt-2 w-full border border-zinc-300 bg-transparent px-3 py-2.5 font-sans text-sm outline-none focus:border-[var(--career-neon)] dark:border-zinc-700"
          name="coverLetter"
          rows={5}
        />
      </label>
      <label className="mt-4 block">
        <span className="career-eyebrow text-zinc-500">Resume (PDF or Word, max 5 MB)</span>
        <input
          className="mt-2 w-full font-sans text-xs file:mr-3 file:border-0 file:bg-[var(--career-neon)] file:px-3 file:py-2 file:font-sans file:text-xs file:font-bold file:uppercase file:text-black"
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />
      </label>
      <button
        className="mt-6 inline-flex min-h-11 items-center bg-[var(--career-neon)] px-5 font-sans text-xs font-bold uppercase tracking-wide text-black"
        type="submit"
        disabled={pending}
      >
        {pending ? "Sending" : "Submit application"}
      </button>
    </form>
  );
}
