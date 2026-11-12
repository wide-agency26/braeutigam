"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth/dal";
import { uniqueSlug } from "@/lib/slug";
import { CMS_BASE, CMS_JOBS } from "@/lib/cms";
import { z } from "zod";
import { fieldErrors, jobSchema, type FieldErrors } from "@/lib/validations";

export type JobState = {
  error?: string;
  fieldErrors?: FieldErrors;
};

function readJob(formData: FormData) {
  return jobSchema.safeParse({
    title: formData.get("title"),
    department: formData.get("department"),
    location: formData.get("location"),
    employmentType: formData.get("employmentType"),
    status: formData.get("status"),
    description: formData.get("description"),
    requirements: formData.get("requirements") ?? "",
    titleEn: formData.get("titleEn") ?? "",
    descriptionEn: formData.get("descriptionEn") ?? "",
    requirementsEn: formData.get("requirementsEn") ?? "",
  });
}

function emptyToNull(value: string) {
  return value.trim().length > 0 ? value.trim() : null;
}

function jobWriteData(parsed: z.infer<typeof jobSchema>) {
  return {
    title: parsed.title,
    department: parsed.department,
    location: parsed.location,
    employmentType: parsed.employmentType,
    status: parsed.status,
    description: parsed.description,
    requirements: parsed.requirements,
    titleEn: emptyToNull(parsed.titleEn ?? ""),
    descriptionEn: emptyToNull(parsed.descriptionEn ?? ""),
    requirementsEn: emptyToNull(parsed.requirementsEn ?? ""),
  };
}

function revalidateJobs(slug?: string) {
  revalidatePath("/karriere");
  revalidatePath("/en/karriere");
  revalidatePath(CMS_BASE);
  revalidatePath(CMS_JOBS);
  if (slug) {
    revalidatePath(`/karriere/${slug}`);
    revalidatePath(`/en/karriere/${slug}`);
  }
}

export async function createJob(
  _prev: JobState | undefined,
  formData: FormData,
): Promise<JobState> {
  await verifySession();
  const parsed = readJob(formData);
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }

  const slug = await uniqueSlug(parsed.data.title, async (candidate) => {
    const found = await prisma.job.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    return Boolean(found);
  });

  const job = await prisma.job.create({
    data: { ...jobWriteData(parsed.data), slug },
  });

  revalidateJobs(job.slug);
  redirect(`${CMS_JOBS}/${job.id}`);
}

export async function updateJob(
  id: string,
  _prev: JobState | undefined,
  formData: FormData,
): Promise<JobState> {
  await verifySession();
  const existing = await prisma.job.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Job posting was not found." };
  }

  const parsed = readJob(formData);
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error) };
  }

  // Titles can change without breaking already-shared application links.
  const slug = existing.slug;

  await prisma.job.update({
    where: { id },
    data: { ...jobWriteData(parsed.data), slug },
  });

  revalidateJobs(slug);
  redirect(`${CMS_JOBS}/${id}`);
}

export async function deleteJob(formData: FormData) {
  await verifySession();
  const id = String(formData.get("id") ?? "");
  const job = await prisma.job.findUnique({
    where: { id },
    select: { slug: true, _count: { select: { applications: true } } },
  });
  if (!job) {
    redirect(CMS_JOBS);
  }

  await prisma.$transaction(async tx => {
    // Lock the parent so a concurrent application cannot race an empty-job deletion.
    await tx.$queryRaw`SELECT id FROM "Job" WHERE id = ${id} FOR UPDATE`;
    const applicants = await tx.application.count({ where: { jobId: id } });
    if (applicants > 0) {
      await tx.job.update({ where: { id }, data: { status: "CLOSED" } });
    } else {
      await tx.job.deleteMany({ where: { id } });
    }
  });
  revalidateJobs(job.slug);
  redirect(CMS_JOBS);
}
