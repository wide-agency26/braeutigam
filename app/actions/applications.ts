"use server";

import { createHash, randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth/dal";
import { CMS_APPLICATIONS, CMS_BASE } from "@/lib/cms";
import { rateLimitForRequest } from "@/lib/application-rate-limit";
import {
  identifyResume,
  MAX_RESUME_BYTES,
  RESUME_ERRORS,
  sanitizeResumeName,
} from "@/lib/resume-file";
import {
  deleteResumeObject,
  resumeObjectKey,
  storedResumePath,
  uploadResumeObject,
} from "@/lib/storage";
import {
  applicationSchema,
  applicationStatusSchema,
  fieldErrors,
  type FieldErrors,
} from "@/lib/validations";

export type ApplyState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: FieldErrors;
};

export async function applyToJob(
  jobId: string,
  _prev: ApplyState | undefined,
  formData: FormData,
): Promise<ApplyState> {
  if (String(formData.get("companyWebsite") ?? "").trim()) {
    return { ok: true };
  }

  try {
    const job = await prisma.job.findFirst({
      where: { id: jobId, status: "PUBLISHED" },
      select: { id: true },
    });
    if (!job) {
      return { error: "This posting is no longer open." };
    }

    const parsed = applicationSchema.safeParse({
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
      return { error: RESUME_ERRORS.count };
    }
    if (files.length !== 1) {
      return { error: RESUME_ERRORS.empty };
    }

    const resume = files[0];
    if (resume.size === 0) {
      return { error: RESUME_ERRORS.empty };
    }
    if (resume.size > MAX_RESUME_BYTES) {
      return { error: RESUME_ERRORS.size };
    }

    const bytes = Buffer.from(await resume.arrayBuffer());
    if (bytes.length === 0) {
      return { error: RESUME_ERRORS.empty };
    }
    if (bytes.length > MAX_RESUME_BYTES) {
      return { error: RESUME_ERRORS.size };
    }
    const kind = identifyResume(bytes);
    if (!kind) {
      return { error: RESUME_ERRORS.type };
    }

    const { limited, ipHash } = await rateLimitForRequest();
    if (limited) {
      return { error: RESUME_ERRORS.rate };
    }

    const applicationId = randomUUID();
    const objectKey = resumeObjectKey(applicationId, randomUUID(), kind.ext);
    await uploadResumeObject(objectKey, new Uint8Array(bytes), kind.mime);

    try {
      await prisma.$transaction([
        prisma.application.create({
          data: {
            id: applicationId,
            jobId,
            ...parsed.data,
            resumePath: storedResumePath(objectKey),
            resumeName: sanitizeResumeName(resume.name, kind.ext),
            resumeMime: kind.mime,
            resumeSize: bytes.length,
            resumeSha256: createHash("sha256").update(bytes).digest("hex"),
          },
        }),
        prisma.applicationRateLimit.create({ data: { ipHash } }),
      ]);
    } catch {
      await deleteResumeObject(objectKey).catch(() => undefined);
      return { error: RESUME_ERRORS.save };
    }

    revalidatePath(CMS_BASE);
    revalidatePath(CMS_APPLICATIONS);
    return { ok: true };
  } catch {
    return { error: RESUME_ERRORS.save };
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
