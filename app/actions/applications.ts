"use server";

import { createHash, randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { saveApplicationWithRateLimit } from "@/lib/data/save-application";
import { verifySession } from "@/lib/auth/dal";
import { CMS_APPLICATIONS, CMS_BASE } from "@/lib/cms";
import { rateLimitForRequest } from "@/lib/application-rate-limit";
import {
  identifyResume,
  MAX_RESUME_BYTES,
  sanitizeResumeName,
} from "@/lib/resume-file";
import {
  deleteResumeObject,
  resumeObjectKey,
  storedResumePath,
  uploadResumeObject,
} from "@/lib/storage";
import {
  createApplicationSchema,
  applicationStatusSchema,
  fieldErrors,
  type FieldErrors,
} from "@/lib/validations";
import { resumeErrors } from "@/lib/resume-limits";
import { verifyTurnstile } from "@/lib/turnstile";

export type ApplyState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: FieldErrors;
};

export async function applyToJob(
  _prev: ApplyState | undefined,
  formData: FormData,
): Promise<ApplyState> {
  const locale = formData.get("locale") === "en" ? "en" : "de";
  const errors = resumeErrors(locale);
  const jobId = String(formData.get("jobId") ?? "");
  if (String(formData.get("companyWebsite") ?? "").trim()) {
    return { ok: true };
  }

  try {
    const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");
    const turnstileOk = await verifyTurnstile(turnstileToken);
    if (!turnstileOk) {
      return { error: locale === "en"
        ? "The security check failed. Please try again."
        : "Die Sicherheitsprüfung ist fehlgeschlagen. Bitte versuchen Sie es erneut." };
    }

    const job = await prisma.job.findFirst({
      where: { id: jobId, status: "PUBLISHED" },
      select: { id: true },
    });
    if (!job) {
      return { error: locale === "en" ? "This posting is no longer open." : "Diese Stelle ist nicht mehr ausgeschrieben." };
    }

    const parsed = createApplicationSchema(locale).safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone") ?? "",
      coverLetter: formData.get("coverLetter") ?? "",
      wasRecommended: formData.get("wasRecommended") === "on",
      recommenderName: formData.get("recommenderName") ?? "",
    });
    if (!parsed.success) {
      return { fieldErrors: fieldErrors(parsed.error) };
    }

    const files = formData
      .getAll("resume")
      .filter((entry): entry is File => entry instanceof File);
    if (files.length > 1) {
      return { error: errors.count };
    }
    if (files.length !== 1) {
      return { error: errors.empty };
    }

    const resume = files[0];
    if (resume.size === 0) {
      return { error: errors.empty };
    }
    if (resume.size > MAX_RESUME_BYTES) {
      return { error: errors.size };
    }

    const bytes = Buffer.from(await resume.arrayBuffer());
    if (bytes.length === 0) {
      return { error: errors.empty };
    }
    if (bytes.length > MAX_RESUME_BYTES) {
      return { error: errors.size };
    }
    const kind = identifyResume(bytes);
    if (!kind) {
      return { error: errors.type };
    }

    const { limited, ipHash } = await rateLimitForRequest();
    if (limited) {
      return { error: errors.rate };
    }

    const applicationId = randomUUID();
    const retainUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const objectKey = resumeObjectKey(applicationId, randomUUID(), kind.ext);
    await uploadResumeObject(objectKey, new Uint8Array(bytes), kind.mime);

    try {
      await saveApplicationWithRateLimit({
        id: applicationId, jobId, ...parsed.data,
        resumePath: storedResumePath(objectKey),
        resumeName: sanitizeResumeName(resume.name, kind.ext),
        resumeMime: kind.mime, resumeSize: bytes.length,
        resumeSha256: createHash("sha256").update(bytes).digest("hex"),
        retainUntil,
      }, ipHash);
    } catch {
      await deleteResumeObject(objectKey).catch(() => undefined);
      return { error: errors.save };
    }

    revalidatePath(CMS_BASE);
    revalidatePath(CMS_APPLICATIONS);
    return { ok: true };
  } catch {
    return { error: errors.save };
  }
}

export async function updateApplicationStatus(formData: FormData) {
  await verifySession();
  const id = String(formData.get("id") ?? "");
  const parsed = applicationStatusSchema.safeParse(formData.get("status"));
  if (!id || !parsed.success) {
    return;
  }

  await prisma.application.update({
    where: { id },
    data: { status: parsed.data },
  });

  revalidatePath(CMS_BASE);
  revalidatePath(CMS_APPLICATIONS);
  revalidatePath(`${CMS_APPLICATIONS}/${id}`);
}
