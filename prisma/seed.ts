import { ApplicationStatus, EmploymentType, JobStatus, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const jobs: Array<{
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  status: JobStatus;
  description: string;
  requirements: string;
}> = [
  {
    slug: "senior-carbon-fiber-laminator",
    title: "Senior Carbon Fiber Laminator",
    department: "PRODUCTION",
    location: "GERMANY [48.9° N, 9.2° E]",
    employmentType: "FULL_TIME",
    status: "PUBLISHED",
    description:
      "You lay the fibre. Autoclave cycles, ply books, and show-surface work for motorsport and hypercar programmes. This is a bench role in the cleanroom, not a clipboard job.\n\nWe need someone who can read a ply book, feel a dry fabric, and stop a cure if the bag is wrong.",
    requirements:
      "Several years laminating structural carbon parts\nComfortable with prepreg, vacuum bagging, and autoclave discipline\nAble to work from German and English ply books\nShift work during race-build peaks",
  },
  {
    slug: "cad-cam-catia-design-engineer",
    title: "CAD/CAM Catia Design Engineer",
    department: "ENGINEERING",
    location: "GERMANY [48.9° N, 9.2° E]",
    employmentType: "FULL_TIME",
    status: "PUBLISHED",
    description:
      "Design fibre layouts and tooling in Catia so the mill and the laminators are not guessing. You sit between aero intent and a part that can actually be built.\n\nYou own stacking sequences, nestings, and the CAM that cuts the kit.",
    requirements:
      "Catia V5 or 3DEXPERIENCE, composites workbench preferred\nExperience designing for autoclave or press-cure carbon\nClear drawings and ply books that production can trust\nMotorsport or aero structures background helps",
  },
  {
    slug: "quality-inspector-ndt-metrology",
    title: "Quality Inspector, NDT and Metrology",
    department: "QUALITY",
    location: "GERMANY [48.9° N, 9.2° E]",
    employmentType: "FULL_TIME",
    status: "PUBLISHED",
    description:
      "Nothing leaves Weissach because it looks right. You inspect cured parts, catch porosity, and sign metrology reports that racing programmes can defend.\n\nYou will run NDT and CMM work on structural and show-surface carbon.",
    requirements:
      "NDT experience on composites (ultrasound or similar)\nMetrology / CMM practice\nWritten reports in German or English\nCalm under delivery pressure",
  },
  {
    slug: "project-lead-motorsport-programs",
    title: "Project Lead, Motorsport Programs",
    department: "MANAGEMENT",
    location: "GERMANY [48.9° N, 9.2° E]",
    employmentType: "FULL_TIME",
    status: "PUBLISHED",
    description:
      "You hold the calendar between the customer racing team and our autoclave slots. When a test date moves, you re-sequence the shop without losing the plot.\n\nThis is a production-aware PM role, not a pure office job.",
    requirements:
      "Project leadership in motorsport, aero, or composite manufacturing\nGerman and English, spoken and written\nAble to sit with laminators and with customer engineers\nTravel to teams as needed",
  },
  {
    slug: "cnc-cutting-materials-technician",
    title: "CNC Cutting and Materials Technician",
    department: "CUTTING",
    location: "GERMANY [48.9° N, 9.2° E]",
    employmentType: "FULL_TIME",
    status: "PUBLISHED",
    description:
      "Nest and cut prepreg kits so the laminators never wait on a missing ply. You keep the freezer log honest and the cutter fed.\n\nMaterial discipline is the job: out-time, batch codes, zero mix-ups.",
    requirements:
      "CNC cutter or similar nesting experience\nPrepreg handling and freezer discipline\nCareful with batch traceability\nAble to work early shifts when kits must be ready",
  },
  {
    slug: "composite-apprentice",
    title: "Composite Apprentice",
    department: "PRODUCTION",
    location: "GERMANY [48.9° N, 9.2° E]",
    employmentType: "APPRENTICESHIP",
    status: "DRAFT",
    description:
      "Draft posting for the next Ausbildung cycle. Not public yet. We will open this when the training plan is signed off with the chamber.",
    requirements:
      "Interest in handwork and materials\nSecondary school completed or in progress\nGerman language for shop-floor instruction",
  },
  {
    slug: "weekend-autoclave-operator",
    title: "Weekend Autoclave Operator",
    department: "PRODUCTION",
    location: "GERMANY [48.9° N, 9.2° E]",
    employmentType: "PART_TIME",
    status: "CLOSED",
    description:
      "Closed after the 2025 season. Kept in the ledger so we can reopen if weekend cures return.",
    requirements:
      "Prior autoclave operation\nWeekend availability",
  },
];

const applications: Array<{
  jobSlug: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
  status: ApplicationStatus;
  resumeName: string | null;
  createdOffsetDays: number;
}> = [
  {
    jobSlug: "senior-carbon-fiber-laminator",
    firstName: "Lukas",
    lastName: "Brenner",
    email: "lukas.brenner@example.test",
    phone: "+49 171 440 1120",
    coverLetter:
      "Six seasons in a GT3 composite shop. I want a structural bench, not repair-only work.",
    status: "SHORTLISTED",
    resumeName: "Brenner_Lukas_CV.pdf",
    createdOffsetDays: 18,
  },
  {
    jobSlug: "senior-carbon-fiber-laminator",
    firstName: "Tomas",
    lastName: "Novak",
    email: "tomas.novak@example.test",
    phone: "+420 777 221 009",
    coverLetter: "Prepreg and autoclave from an aero supplier in Brno. Ready to relocate.",
    status: "REVIEWING",
    resumeName: "Novak_Tomas_CV.pdf",
    createdOffsetDays: 9,
  },
  {
    jobSlug: "cad-cam-catia-design-engineer",
    firstName: "Anja",
    lastName: "Hofmann",
    email: "anja.hofmann@example.test",
    phone: "+49 176 880 3341",
    coverLetter: "Catia composites workbench for two OEM aero programmes. Ply books are my product.",
    status: "NEW",
    resumeName: "Hofmann_Anja_CV.pdf",
    createdOffsetDays: 3,
  },
  {
    jobSlug: "cad-cam-catia-design-engineer",
    firstName: "Priya",
    lastName: "Shah",
    email: "priya.shah@example.test",
    phone: "+44 7700 900 214",
    coverLetter: "CAM nesting and kit definition for a UK hypercar programme.",
    status: "REVIEWING",
    resumeName: "Shah_Priya_CV.pdf",
    createdOffsetDays: 11,
  },
  {
    jobSlug: "quality-inspector-ndt-metrology",
    firstName: "Mehmet",
    lastName: "Yilmaz",
    email: "mehmet.yilmaz@example.test",
    phone: "+49 152 2200 7781",
    coverLetter: "UT on carbon monocoques plus CMM sign-off. Looking for motorsport pace.",
    status: "NEW",
    resumeName: "Yilmaz_Mehmet_CV.pdf",
    createdOffsetDays: 2,
  },
  {
    jobSlug: "quality-inspector-ndt-metrology",
    firstName: "Elena",
    lastName: "Rossi",
    email: "elena.rossi@example.test",
    phone: "+39 347 110 2298",
    coverLetter: "Metrology lab in Modena. English reports, German in progress.",
    status: "REJECTED",
    resumeName: null,
    createdOffsetDays: 21,
  },
  {
    jobSlug: "project-lead-motorsport-programs",
    firstName: "Sophie",
    lastName: "Kraemer",
    email: "sophie.kraemer@example.test",
    phone: "+49 160 445 7780",
    coverLetter: "PM for a DTM composite supplier. I already speak autoclave calendars.",
    status: "SHORTLISTED",
    resumeName: "Kraemer_Sophie_CV.pdf",
    createdOffsetDays: 7,
  },
  {
    jobSlug: "cnc-cutting-materials-technician",
    firstName: "Jonas",
    lastName: "Weber",
    email: "jonas.weber@example.test",
    phone: "+49 175 330 4412",
    coverLetter: "Cutter operator at a wind-blade shop. I want motorsport kit discipline.",
    status: "NEW",
    resumeName: "Weber_Jonas_CV.pdf",
    createdOffsetDays: 1,
  },
  {
    jobSlug: "cnc-cutting-materials-technician",
    firstName: "Mira",
    lastName: "Olsen",
    email: "mira.olsen@example.test",
    phone: "+45 20 12 34 88",
    coverLetter: "Materials store and nesting in a Danish prepreg plant.",
    status: "HIRED",
    resumeName: "Olsen_Mira_CV.pdf",
    createdOffsetDays: 40,
  },
];

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@braeutigam.local";
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 10) {
    throw new Error("ADMIN_PASSWORD must be set (10+ characters) before seeding.");
  }

  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.admin.deleteMany();

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.create({
    data: {
      email: email.toLowerCase(),
      name: "Desk",
      passwordHash,
    },
  });

  for (const job of jobs) {
    await prisma.job.create({ data: job });
  }

  const jobRows = await prisma.job.findMany({ select: { id: true, slug: true } });
  const bySlug = new Map(jobRows.map((job) => [job.slug, job.id]));

  for (const application of applications) {
    const jobId = bySlug.get(application.jobSlug);
    if (!jobId) continue;

    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - application.createdOffsetDays);

    await prisma.application.create({
      data: {
        jobId,
        firstName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        phone: application.phone,
        coverLetter: application.coverLetter,
        status: application.status,
        resumeName: application.resumeName,
        createdAt,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
