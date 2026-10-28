"use client";

import { type FormEvent, useActionState, useId, useState } from "react";
import { applyToJob, type ApplyState } from "@/app/actions/applications";
import { MAX_RESUME_BYTES, RESUME_ERRORS } from "@/lib/resume-limits";

const INITIAL: ApplyState = {};

export function ApplyForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const action = applyToJob.bind(null, jobId);
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const [wasRecommended, setWasRecommended] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const tooLarge = new FormData(event.currentTarget)
      .getAll("resume")
      .filter((entry): entry is File => entry instanceof File)
      .some((file) => file.size > MAX_RESUME_BYTES);
    if (!tooLarge) {
      setClientError(null);
      return;
    }
    event.preventDefault();
    setClientError(RESUME_ERRORS.size);
  }
  const formId = useId();
  const errors = state.fieldErrors;
  const inputClass =
    "mt-2 w-full border border-zinc-300 bg-transparent px-3 py-2.5 font-sans text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--career-neon)] dark:border-zinc-700";

  if (state.ok) {
    return (
      <div className="career-card px-5 py-6" role="status" aria-live="polite">
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
    <form action={formAction} className="career-card px-5 py-6" aria-labelledby={`${formId}-title`} onSubmit={onSubmit}>
      <p className="career-eyebrow text-[var(--career-neon)]">Apply</p>
      <h2 id={`${formId}-title`} className="mt-4 font-sans text-sm font-bold uppercase tracking-tight">
        Send your file
      </h2>
      {clientError || state.error ? (
        <p className="mt-3 font-sans text-xs text-red-600" role="alert">{clientError || state.error}</p>
      ) : null}

      <label className="mt-5 block">
        <span className="career-eyebrow text-zinc-500">First name</span>
        <input
          className={inputClass}
          name="firstName"
          autoComplete="given-name"
          required
          aria-invalid={Boolean(errors?.firstName)}
          aria-describedby={errors?.firstName ? `${formId}-first-name-error` : undefined}
        />
        {errors?.firstName ? (
          <p id={`${formId}-first-name-error`} className="mt-1 font-sans text-xs text-red-600">{errors.firstName[0]}</p>
        ) : null}
      </label>
      <label className="mt-4 block">
        <span className="career-eyebrow text-zinc-500">Last name</span>
        <input
          className={inputClass}
          name="lastName"
          autoComplete="family-name"
          required
          aria-invalid={Boolean(errors?.lastName)}
          aria-describedby={errors?.lastName ? `${formId}-last-name-error` : undefined}
        />
        {errors?.lastName ? (
          <p id={`${formId}-last-name-error`} className="mt-1 font-sans text-xs text-red-600">{errors.lastName[0]}</p>
        ) : null}
      </label>
      <label className="mt-4 block">
        <span className="career-eyebrow text-zinc-500">Email</span>
        <input
          className={inputClass}
          type="email"
          name="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(errors?.email)}
          aria-describedby={errors?.email ? `${formId}-email-error` : undefined}
        />
        {errors?.email ? (
          <p id={`${formId}-email-error`} className="mt-1 font-sans text-xs text-red-600">{errors.email[0]}</p>
        ) : null}
      </label>
      <label className="mt-4 block">
        <span className="career-eyebrow text-zinc-500">Phone</span>
        <input
          className={inputClass}
          type="tel"
          name="phone"
          autoComplete="tel"
        />
      </label>
      <label className="mt-4 block">
        <span className="career-eyebrow text-zinc-500">Cover letter</span>
        <textarea
          className={inputClass}
          name="coverLetter"
          rows={5}
        />
      </label>
      <div className="mt-5">
        <label className="flex min-h-11 cursor-pointer items-center gap-3 font-sans text-sm">
          <input
            className="h-5 w-5 accent-[var(--career-neon)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--career-neon)]"
            type="checkbox"
            name="wasRecommended"
            checked={wasRecommended}
            onChange={(event) => setWasRecommended(event.currentTarget.checked)}
            aria-controls={`${formId}-recommender`}
            aria-expanded={wasRecommended}
          />
          <span>I was recommended</span>
        </label>
        {wasRecommended ? (
          <label id={`${formId}-recommender`} className="mt-3 block">
            <span className="career-eyebrow text-zinc-500">Name of the person who recommended me</span>
            <input
              className={inputClass}
              name="recommenderName"
              autoComplete="name"
              required
              aria-invalid={Boolean(errors?.recommenderName)}
              aria-describedby={errors?.recommenderName ? `${formId}-recommender-error` : undefined}
            />
            {errors?.recommenderName ? (
              <p id={`${formId}-recommender-error`} className="mt-1 font-sans text-xs text-red-600">
                {errors.recommenderName[0]}
              </p>
            ) : null}
          </label>
        ) : null}
      </div>
      <label className="mt-4 block">
        <span className="career-eyebrow text-zinc-500">Resume (PDF or Word, max 4 MB)</span>
        <input
          className="mt-2 w-full font-sans text-xs file:mr-3 file:border-0 file:bg-[var(--career-neon)] file:px-3 file:py-2 file:font-sans file:text-xs file:font-bold file:uppercase file:text-black"
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          required
        />
      </label>
      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Company website
          <input name="companyWebsite" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <button
        className="mt-6 inline-flex min-h-11 items-center bg-[var(--career-neon)] px-5 font-sans text-xs font-bold uppercase tracking-wide text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--career-neon)] disabled:cursor-wait disabled:opacity-60"
        type="submit"
        disabled={pending}
      >
        {pending ? "Sending" : "Submit application"}
      </button>
    </form>
  );
}
