"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth/dal";
import { CMS_APPLICATIONS, CMS_BASE } from "@/lib/cms";
import { saveResume } from "@/lib/uploads";
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
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }

  const resume = formData.get("resume");
  let resumePath: string | undefined;
  let resumeName: string | undefined;
  if (resume instanceof File && resume.size > 0) {
    const saved = await saveResume(resume);
    if ("error" in saved) {
      return { error: saved.error };
    }
    resumePath = saved.relative;
    resumeName = saved.originalName;
  }

  await prisma.application.create({
    data: {
      jobId,
      ...parsed.data,
      resumePath,
      resumeName,
    },
  });

  revalidatePath(CMS_BASE);
  revalidatePath(CMS_APPLICATIONS);
  return { ok: true };
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
