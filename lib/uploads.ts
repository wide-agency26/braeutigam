import fs from "node:fs/promises";
import path from "node:path";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads", "resumes");

const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
};

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export function extensionForMime(mime: string) {
  return ALLOWED_TYPES[mime] ?? null;
}

export async function saveResume(file: File) {
  const ext = extensionForMime(file.type);
  if (!ext) {
    return { error: "Resume must be a PDF or Word file." as const };
  }
  if (file.size > MAX_RESUME_BYTES) {
    return { error: "Resume must be 5 MB or smaller." as const };
  }

  const id = crypto.randomUUID();
  const relative = `${id}${ext}`;
  await fs.mkdir(UPLOAD_ROOT, { recursive: true });
  const absolute = path.join(UPLOAD_ROOT, relative);
  await fs.writeFile(absolute, Buffer.from(await file.arrayBuffer()));

  return { relative, originalName: sanitizeFilename(file.name) };
}

export async function readResume(relativePath: string) {
  const root = path.resolve(UPLOAD_ROOT);
  const absolute = path.resolve(root, relativePath);
  if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`)) {
    return null;
  }

  try {
    return await fs.readFile(absolute);
  } catch {
    return null;
  }
}

function sanitizeFilename(name: string) {
  const base = name.replace(/[/\\]/g, "").replace(/[^\w.\- ()äöüÄÖÜß]+/g, "_");
  const trimmed = base.trim().slice(0, 120);
  return trimmed || "resume.pdf";
}
