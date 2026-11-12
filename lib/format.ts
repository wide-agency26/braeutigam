import type { ApplicationStatus, EmploymentType, JobStatus } from "@prisma/client";

export function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function formatDate(value: Date) {
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(value);
}

export function formatDepartment(value: string) {
  if (!value || value !== value.toUpperCase()) return value;
  return value.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

export const JOB_STATUS_LABEL: Record<JobStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  CLOSED: "Closed",
};

export const EMPLOYMENT_LABEL: Record<EmploymentType, string> = {
  FULL_TIME: "Full time",
  PART_TIME: "Part time",
  APPRENTICESHIP: "Apprenticeship",
};

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  NEW: "New (legacy)",
  REVIEWING: "Reviewing (legacy)",
  SHORTLISTED: "Shortlisted (legacy)",
  REJECTED: "Rejected (legacy)",
  HIRED: "Hired (legacy)",
  REACHED_OUT: "Reached out",
  FIRST_INTERVIEW: "First interview",
  INTERNAL_DECISION: "Internal decision",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
};

export const APPLICATION_PIPELINE_STATUSES: ApplicationStatus[] = [
  "REACHED_OUT",
  "FIRST_INTERVIEW",
  "INTERNAL_DECISION",
  "ACCEPTED",
  "DECLINED",
];

export function retentionBadgeLabel(retainUntil: Date | null | undefined, now = new Date()) {
  if (!retainUntil) return null;
  const ms = retainUntil.getTime() - now.getTime();
  if (ms <= 0) return "CV expiry reached — pending scheduled removal";
  const days = Math.ceil(ms / (24 * 60 * 60 * 1000));
  if (days > 7) return null;
  return `CV removed in ${days} day${days === 1 ? "" : "s"}`;
}
