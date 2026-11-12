import assert from "node:assert/strict";
import { test } from "node:test";
import { cvExpiry, processCvRetention, DAY_MS, type RetentionCandidate } from "../lib/cv-retention";
import { instagramPermalink, matchesMediaSignature } from "../lib/content/config";
import { teamSchema, videoSchema, reelSchema } from "../lib/content/validation";

const now = new Date("2026-11-11T12:00:00Z");
const candidate = (overrides: Partial<RetentionCandidate> = {}): RetentionCandidate => ({
  id: "test", resumePath: "resumes/test/file.pdf", retainUntil: now,
  resumeDeletionNoticeAt: new Date(now.getTime() - 7 * DAY_MS), ...overrides,
});
function adapters(fail = false) {
  const calls: string[] = [];
  return { calls, api: {
    objectKey: (path: string) => path.startsWith("resumes/") ? path.slice(8) : null,
    remove: async () => { calls.push("remove"); if (fail) throw new Error("Storage outage"); },
    notify: async () => { calls.push("notice"); },
    clear: async () => { calls.push("clear-cv-metadata"); },
    failed: async () => { calls.push("record-failure"); },
  } };
}
test("30-day retention is independent of calendar month/DST boundaries", () => {
  assert.equal(cvExpiry(new Date("2026-10-25T01:30:00Z")).toISOString(), "2026-11-24T01:30:00.000Z");
});
test("seven-day warning does not remove an unexpired CV", async () => {
  const a = adapters();
  const result = await processCvRetention([candidate({ retainUntil: new Date(now.getTime() + 7 * DAY_MS), resumeDeletionNoticeAt: null })], a.api, now);
  assert.deepEqual(a.calls, ["notice"]); assert.equal(result.notified, 1);
});
test("a newly discovered overdue CV gets notice before deletion", async () => {
  const a = adapters();
  await processCvRetention([candidate({ retainUntil: new Date(now.getTime() - DAY_MS), resumeDeletionNoticeAt: null })], a.api, now);
  assert.deepEqual(a.calls, ["notice"]);
  const b = adapters();
  await processCvRetention([candidate({ resumeDeletionNoticeAt: new Date(now.getTime() - DAY_MS + 1) })], b.api, now);
  assert.deepEqual(b.calls, []);
});
test("expiry removes only the file and clears metadata after successful deletion", async () => {
  const a = adapters();
  const result = await processCvRetention([candidate()], a.api, now);
  assert.deepEqual(a.calls, ["remove", "clear-cv-metadata"]); assert.equal(result.deleted, 1);
});
test("storage failure preserves the reference for the next retry", async () => {
  const a = adapters(true);
  const result = await processCvRetention([candidate()], a.api, now);
  assert.deepEqual(a.calls, ["remove", "record-failure"]); assert.equal(result.failed, 1);
  const retry = adapters();
  await processCvRetention([candidate()], retry.api, now);
  assert.deepEqual(retry.calls, ["remove", "clear-cv-metadata"]);
});
test("unknown bucket paths and already-cleared CVs cannot remove storage objects", async () => {
  const a = adapters();
  await processCvRetention([candidate({ resumePath: "site-media/video.mp4" }), candidate({ resumePath: null })], a.api, now);
  assert.deepEqual(a.calls, ["record-failure"]);
});
test("Instagram reel links are normalized and hostile destinations rejected", () => {
  assert.equal(instagramPermalink("https://www.instagram.com/braeutigamgmbh/reel/AbC_12-/?igsh=test"), "https://www.instagram.com/reel/AbC_12-/");
  for (const url of ["javascript:alert(1)", "https://www.instagram.com.evil.test/reel/123", "https://user:pass@instagram.com/reel/123/", "http://instagram.com/reel/123/", "https://instagram.com/p/123/", "https://instagram.com:8000/reel/123/"]) assert.equal(instagramPermalink(url), null);
});
test("a declared media MIME type is insufficient without matching bytes", () => {
  assert.equal(matchesMediaSignature(Buffer.from("<script>hello</script>"), "image/webp"), false);
  assert.equal(matchesMediaSignature(Buffer.from("RIFFxxxxWEBPVP8 "), "image/webp"), true);
  assert.equal(matchesMediaSignature(Buffer.from("xxxxftypisom"), "video/mp4"), true);
  assert.equal(matchesMediaSignature(Buffer.from("xxxxftypavif"), "video/mp4"), false);
  assert.equal(matchesMediaSignature(new Uint8Array([0x1a, 0x45, 0xdf, 0xa3]), "video/webm"), true);
});
test("CMS rejects missing media, unknown placements, bad email, and invalid ordering", () => {
  assert.equal(teamSchema.safeParse({ name: "Test", title: "Test", email: "bad", phone: "", memberId: "TEST", avatarUrl: "", showContact: false, published: false, sortOrder: -1 }).success, false);
  assert.equal(videoSchema.safeParse({ placement: "arbitrary-route", title: "Test", description: "", descriptionEn: "", videoUrl: "", posterUrl: "", transcript: "", transcriptEn: "", published: true }).success, false);
  assert.equal(reelSchema.safeParse({ title: "Test", permalink: "https://evil.test/reel/123", imageUrl: "/images/social/reels/test.webp", published: true, sortOrder: 0 }).success, false);
});
