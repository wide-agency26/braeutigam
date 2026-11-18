export const RESUME_BUCKET = "resumes";

export function resumeObjectKey(applicationId: string, fileId: string, ext: string) {
  return `${applicationId}/${fileId}.${ext}`;
}

export function storedResumePath(objectKey: string) {
  return `${RESUME_BUCKET}/${objectKey}`;
}

export function objectKeyFromStoredPath(storedPath: string) {
  const prefix = `${RESUME_BUCKET}/`;
  if (
    !storedPath.startsWith(prefix) ||
    storedPath.includes("..") ||
    storedPath.includes("\\") ||
    storedPath.includes("//")
  ) {
    return null;
  }
  const key = storedPath.slice(prefix.length);
  if (!key || key.startsWith("/")) return null;
  return key;
}
