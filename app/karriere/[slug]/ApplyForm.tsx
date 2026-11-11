"use client";

import Script from "next/script";
import { type FormEvent, useActionState, useId, useState } from "react";
import { applyToJob, type ApplyState } from "@/app/actions/applications";
import { getDictionary, type Locale } from "@/lib/i18n";
import { MAX_RESUME_BYTES, RESUME_ERRORS } from "@/lib/resume-limits";

const INITIAL: ApplyState = {};
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ApplyForm({
  jobId,
  jobTitle,
  locale = "de",
}: {
  jobId: string;
  jobTitle: string;
  locale?: Locale;
}) {
  const t = getDictionary(locale).apply;
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
        <p className="career-eyebrow copy-tiny text-[var(--career-neon)]">{t.received}</p>
        <h2 className="mt-4 font-sans text-sm font-bold uppercase tracking-tight">
          {t.successTitle}
        </h2>
        <p className="copy-caption mt-2 text-zinc-600 dark:text-zinc-400">
          {t.successBody(jobTitle)}
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="career-card px-5 py-6"
      aria-labelledby={`${formId}-title`}
      onSubmit={onSubmit}
    >
      <p className="career-eyebrow copy-tiny text-[var(--career-neon)]">{t.eyebrow}</p>
      <h2
        id={`${formId}-title`}
        className="mt-4 font-sans text-sm font-bold uppercase tracking-tight"
      >
        {t.title}
      </h2>
      {clientError || state.error ? (
        <p className="mt-3 font-sans text-xs text-red-600" role="alert">
          {clientError || state.error}
        </p>
      ) : null}

      <label className="mt-5 block">
        <span className="career-eyebrow copy-tiny text-zinc-500">{t.firstName}</span>
        <input
          className={inputClass}
          name="firstName"
          autoComplete="given-name"
          required
          aria-invalid={Boolean(errors?.firstName)}
          aria-describedby={errors?.firstName ? `${formId}-first-name-error` : undefined}
        />
        {errors?.firstName ? (
          <p id={`${formId}-first-name-error`} className="mt-1 font-sans text-xs text-red-600">
            {errors.firstName[0]}
          </p>
        ) : null}
      </label>
      <label className="mt-4 block">
        <span className="career-eyebrow copy-tiny text-zinc-500">{t.lastName}</span>
        <input
          className={inputClass}
          name="lastName"
          autoComplete="family-name"
          required
          aria-invalid={Boolean(errors?.lastName)}
          aria-describedby={errors?.lastName ? `${formId}-last-name-error` : undefined}
        />
        {errors?.lastName ? (
          <p id={`${formId}-last-name-error`} className="mt-1 font-sans text-xs text-red-600">
            {errors.lastName[0]}
          </p>
        ) : null}
      </label>
      <label className="mt-4 block">
        <span className="career-eyebrow copy-tiny text-zinc-500">{t.email}</span>
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
          <p id={`${formId}-email-error`} className="mt-1 font-sans text-xs text-red-600">
            {errors.email[0]}
          </p>
        ) : null}
      </label>
      <label className="mt-4 block">
        <span className="career-eyebrow copy-tiny text-zinc-500">{t.phone}</span>
        <input className={inputClass} type="tel" name="phone" autoComplete="tel" />
      </label>
      <label className="mt-4 block">
        <span className="career-eyebrow copy-tiny text-zinc-500">{t.coverLetter}</span>
        <textarea className={inputClass} name="coverLetter" rows={5} />
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
          <span>{t.recommended}</span>
        </label>
        {wasRecommended ? (
          <label id={`${formId}-recommender`} className="mt-3 block">
            <span className="career-eyebrow copy-tiny text-zinc-500">{t.recommender}</span>
            <input
              className={inputClass}
              name="recommenderName"
              autoComplete="name"
              required
              aria-invalid={Boolean(errors?.recommenderName)}
              aria-describedby={
                errors?.recommenderName ? `${formId}-recommender-error` : undefined
              }
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
        <span className="career-eyebrow copy-tiny text-zinc-500">{t.resume}</span>
        <input
          className="mt-2 w-full font-sans text-xs file:mr-3 file:border-0 file:bg-[var(--career-neon)] file:px-3 file:py-2 file:font-sans file:text-xs file:font-bold file:uppercase file:text-black"
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          required
        />
      </label>
      {TURNSTILE_SITE_KEY ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
          <div
            className="cf-turnstile mt-4"
            data-sitekey={TURNSTILE_SITE_KEY}
            data-theme="auto"
          />
        </>
      ) : null}
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
        {pending ? t.submitting : t.submit}
      </button>
    </form>
  );
}
