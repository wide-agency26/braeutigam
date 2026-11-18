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
  titleEn: z.string().trim().max(120).optional().default(""),
  descriptionEn: z.string().trim().max(8000).optional().default(""),
  requirementsEn: z.string().trim().max(4000).optional().default(""),
});

export function createApplicationSchema(locale: "de" | "en" = "de") {
  const en = locale === "en";
  const maxLength = (max: number) => en
    ? `Please use no more than ${max} characters.`
    : `Bitte verwenden Sie höchstens ${max} Zeichen.`;
  return z.object({
    firstName: z.string().trim().min(1, en ? "First name is required." : "Bitte geben Sie Ihren Vornamen ein.").max(80, maxLength(80)),
    lastName: z.string().trim().min(1, en ? "Last name is required." : "Bitte geben Sie Ihren Nachnamen ein.").max(80, maxLength(80)),
    email: z.string().trim().email(en ? "Enter a valid email." : "Bitte geben Sie eine gültige E-Mail-Adresse ein."),
    phone: z.string().trim().max(40, maxLength(40)).optional().default(""),
    coverLetter: z.string().trim().max(4000, maxLength(4000)).optional().default(""),
    wasRecommended: z.boolean().default(false),
    recommenderName: z.string().trim().max(120, maxLength(120)).optional().default(""),
  }).superRefine((data, ctx) => {
    if (data.wasRecommended && data.recommenderName.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["recommenderName"],
        message: en
          ? "Please enter the name of the person who recommended you."
          : "Bitte nennen Sie die Person, die Sie empfohlen hat.",
      });
    }
  }).transform((data) => ({
    ...data,
    recommenderName: data.wasRecommended ? data.recommenderName : "",
  }));
}

export const applicationSchema = createApplicationSchema();

/** CMS writes — pipeline only (legacy enum values remain in Postgres for compatibility). */
export const applicationStatusSchema = z.enum([
  "REACHED_OUT",
  "FIRST_INTERVIEW",
  "INTERNAL_DECISION",
  "ACCEPTED",
  "DECLINED",
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
