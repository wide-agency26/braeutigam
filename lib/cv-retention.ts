/** Pure retention policy; the scheduled route supplies the storage/database adapters. */
export const CV_RETENTION_DAYS = 30;
export const CV_NOTICE_DAYS = 7;
export const DAY_MS = 24 * 60 * 60 * 1000;

export function cvExpiry(createdAt = new Date()) {
  return new Date(createdAt.getTime() + CV_RETENTION_DAYS * DAY_MS);
}

export type RetentionCandidate = {
  id: string;
  resumePath: string | null;
  retainUntil: Date | null;
  resumeDeletionNoticeAt: Date | null;
};

export async function processCvRetention(
  candidates: RetentionCandidate[],
  adapters: {
    objectKey: (path: string) => string | null;
    remove: (key: string) => Promise<void>;
    notify: (id: string, at: Date) => Promise<void>;
    clear: (id: string, path: string, at: Date) => Promise<void>;
    failed: (id: string, at: Date) => Promise<void>;
  },
  now = new Date(),
) {
  const result = { notified: 0, deleted: 0, failed: 0 };
  for (const row of candidates) {
    if (!row.resumePath || !row.retainUntil) continue;
    if (row.retainUntil.getTime() > now.getTime() + CV_NOTICE_DAYS * DAY_MS) continue;
    if (!row.resumeDeletionNoticeAt) {
      // An overdue CV on the first run gets a full day of warning before removal.
      await adapters.notify(row.id, now);
      result.notified++;
      continue;
    }
    if (row.retainUntil > now || now.getTime() - row.resumeDeletionNoticeAt.getTime() < DAY_MS) continue;
    const key = adapters.objectKey(row.resumePath);
    try {
      if (!key) throw new Error("Invalid stored CV path");
      await adapters.remove(key);
      // Only clear metadata after successful storage deletion. Never delete the application.
      await adapters.clear(row.id, row.resumePath, now);
      result.deleted++;
    } catch {
      await adapters.failed(row.id, now);
      result.failed++;
    }
  }
  return result;
}
