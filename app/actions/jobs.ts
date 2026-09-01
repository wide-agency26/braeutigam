"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth/dal";
import { uniqueSlug } from "@/lib/slug";
import { CMS_BASE, CMS_JOBS } from "@/lib/cms";
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
  });
}

function revalidateJobs(slug?: string) {
  revalidatePath("/karriere");
  revalidatePath(CMS_BASE);
  revalidatePath(CMS_JOBS);
  if (slug) revalidatePath(`/karriere/${slug}`);
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
    data: { ...parsed.data, slug },
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

  const slug = await uniqueSlug(parsed.data.title, async (candidate) => {
    const found = await prisma.job.findFirst({
      where: { slug: candidate, NOT: { id } },
      select: { id: true },
    });
    return Boolean(found);
  });

  await prisma.job.update({
    where: { id },
    data: { ...parsed.data, slug },
  });

  revalidateJobs(slug);
  redirect(`${CMS_JOBS}/${id}`);
}

export async function deleteJob(formData: FormData) {
  await verifySession();
  const id = String(formData.get("id") ?? "");
  const job = await prisma.job.findUnique({
    where: { id },
    select: { slug: true },
  });
  if (!job) {
    redirect(CMS_JOBS);
  }

  await prisma.job.delete({ where: { id } });
  revalidateJobs(job.slug);
  redirect(CMS_JOBS);
}
