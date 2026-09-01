import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

export const jobSchema = z.object({
  title: z.string().trim().min(3, "Title needs at least 3 characters.").max(120),
  department: z.string().trim().min(2, "Department is required.").max(80),
  location: z.string().trim().min(2, "Location is required.").max(120),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "APPRENTICESHIP"]),
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"]),
  description: z.string().trim().min(20, "Write a short role description.").max(8000),
  requirements: z.string().trim().max(4000).default(""),
});

export const applicationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(80),
  lastName: z.string().trim().min(1, "Last name is required.").max(80),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().max(40).optional().default(""),
  coverLetter: z.string().trim().max(4000).optional().default(""),
});

export const applicationStatusSchema = z.enum([
  "NEW",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "HIRED",
]);

export type FieldErrors = Record<string, string[] | undefined>;

export function fieldErrors(error: z.ZodError): FieldErrors {
  const bag: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    bag[key] = [...(bag[key] ?? []), issue.message];
  }
  return bag;
}
