// Run the actual sitemap/data modules with isolated job fixtures, never a live DB.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const env = { SITE_INDEXABLE: "false", SITE_URL: "https://www.braeutigam-gmbh.eu/" };
const updatedAt = new Date("2026-11-18T12:00:00Z");
const rows = [
  { slug: "published-role", status: "PUBLISHED", updatedAt },
  { slug: "draft-role", status: "DRAFT", updatedAt },
  { slug: "closed-role", status: "CLOSED", updatedAt },
];
let ready = true;
let fail = false;
let reads = 0;
const modules = {
  "server-only": {},
  "@/lib/prisma": {
    databaseReady: () => ready,
    prisma: { job: { findMany: async ({ where }) => {
      reads++;
      if (fail) throw new Error("Database unavailable");
      return rows.filter((row) => row.status === where.status);
    } } },
  },
};

function load(path) {
  const loaded = { exports: {} };
  const code = ts.transpileModule(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, { exports: loaded.exports, URL, process: { env }, require: (key) => {
    assert.ok(key in modules, `Unexpected dependency: ${key}`);
    return modules[key];
  } });
  return loaded.exports;
}
modules["@/lib/site-config"] = load("lib/site-config.ts");
modules["@/lib/i18n/paths"] = load("lib/i18n/paths.ts");
modules["@/lib/data/jobs"] = load("lib/data/jobs.ts");
const { default: sitemap } = load("app/sitemap.ts");
const { default: robots } = load("app/robots.ts");

assert.equal((await sitemap()).length, 0);
assert.equal(reads, 0, "Noindex previews must not query or advertise jobs");
assert.equal(robots().rules.disallow, "/");
assert.equal(robots().sitemap, undefined);

env.SITE_INDEXABLE = "true";
let entries = await sitemap();
assert.equal(entries.length, 16);
assert.equal(new Set(entries.map((entry) => entry.url)).size, 16);
assert.equal(robots().sitemap, "https://www.braeutigam-gmbh.eu/sitemap.xml");
for (const entry of entries) {
  assert.equal(new URL(entry.url).origin, "https://www.braeutigam-gmbh.eu");
  const languages = entry.alternates.languages;
  assert.ok(Object.values(languages).includes(entry.url));
  for (const url of Object.values(languages)) {
    const counterpart = entries.find((candidate) => candidate.url === url);
    assert.ok(counterpart, `Missing alternate ${url}`);
    assert.deepEqual(counterpart.alternates.languages, languages);
  }
  assert.doesNotMatch(entry.url, /draft-role|closed-role|\/cms|\/api|\/en\/(careers|contact)/);
  if (entry.url.endsWith("published-role")) assert.equal(entry.lastModified, updatedAt);
  else assert.equal(entry.lastModified, undefined);
}
assert.equal(entries.find((e) => e.url.endsWith("/impressum")).alternates.languages.en, "https://www.braeutigam-gmbh.eu/en/imprint");
assert.equal(entries.find((e) => e.url.endsWith("/datenschutz")).alternates.languages.en, "https://www.braeutigam-gmbh.eu/en/privacy");

// A change to publication state or slug must be visible on the next request.
rows[0].status = "CLOSED";
rows[1].status = "PUBLISHED";
rows[1].slug = "newly-published-role";
entries = await sitemap();
assert.ok(entries.some((e) => e.url.endsWith("/newly-published-role")));
assert.ok(!entries.some((e) => e.url.endsWith("/published-role")));
rows.splice(1, 1);
assert.equal((await sitemap()).length, 14);
fail = true;
await assert.rejects(sitemap(), /Database unavailable/);
ready = false;
assert.equal((await sitemap()).length, 14);
env.SITE_URL = "https://canonical.example/";
assert.ok((await sitemap()).every((e) => new URL(e.url).origin === "https://canonical.example"));
console.log("Sitemap: noindex gate, locale pairs, published-only jobs, fresh CMS changes, truthful dates and failure handling passed.");
