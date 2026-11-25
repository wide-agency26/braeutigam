import assert from "node:assert/strict";
import { resolveVideo, videoSchema, youtubeId, type VideoRecord } from "../lib/videos";

const de = "AbCdEfGhI_1", en = "ZyXwVuTsR-2";
for (const link of [
  `https://www.youtube.com/watch?v=${de}&feature=share`,
  `https://youtu.be/${de}?si=example`,
  `https://m.youtube.com/watch?v=${de}`,
  `https://www.youtube-nocookie.com/embed/${de}`,
  `https://youtube.com/shorts/${de}`,
  `https://youtube.com/live/${de}/`,
]) assert.equal(youtubeId(link), de, link);
for (const link of [
  "javascript:alert(1)", "<iframe src='https://youtube.com'></iframe>",
  `https://youtube.com.evil.test/watch?v=${de}`, `https://youtube.com@evil.test/watch?v=${de}`,
  `https://user:password@youtube.com/watch?v=${de}`, `http://youtube.com/watch?v=${de}`,
  `https://youtube.com:8443/watch?v=${de}`, "https://youtube.com/watch?v=short",
  `https://youtu.be/${de}/extra`, "https://youtube.com/playlist?list=example",
]) assert.equal(youtubeId(link), null, link);

const form = { slot: "career-design", mode: "SHARED", urlDe: `https://youtu.be/${de}`, urlEn: "", titleDe: "", titleEn: "", published: true };
assert.ok(videoSchema.safeParse(form).success);
assert.ok(videoSchema.safeParse({ ...form, urlEn: "unfinished hidden field" }).success);
assert.ok(videoSchema.safeParse({ ...form, urlDe: "", published: false }).success);
for (const change of [
  { urlDe: "" }, { urlDe: "https://example.com/video" }, { slot: "arbitrary-slot" },
  { mode: "LOCALIZED" }, { mode: "LOCALIZED", urlEn: "https://example.com" }, { titleEn: "x".repeat(161) },
]) assert.equal(videoSchema.safeParse({ ...form, ...change }).success, false);
assert.ok(videoSchema.safeParse({ ...form, mode: "LOCALIZED", urlEn: `https://youtu.be/${en}` }).success);

const record: VideoRecord = { slot: "career-design", mode: "SHARED", youtubeIdDe: de, youtubeIdEn: en, titleDe: "", titleEn: "English title", published: true };
assert.deepEqual(resolveVideo(record, "de"), { id: de, title: "Konstruktion" });
assert.deepEqual(resolveVideo(record, "en"), { id: de, title: "English title" });
assert.equal(resolveVideo({ ...record, mode: "LOCALIZED" }, "en")?.id, en);
assert.equal(resolveVideo({ ...record, mode: "LOCALIZED", youtubeIdEn: "" }, "en"), null);
for (const change of [{ published: false }, { slot: "unknown" }, { mode: "invalid" }, { youtubeIdDe: "bad" }]) {
  assert.equal(resolveVideo({ ...record, ...change }, "de"), null);
}
console.log("Video URL validation, publish requirements, language selection and draft fallbacks passed.");
