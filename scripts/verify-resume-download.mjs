// Check real route/adapter code with synthetic records and no storage requests.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const { NextResponse } = require('next/server');
function load(path, imports) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, { exports, require: key => {
    assert.ok(key in imports, `Unexpected dependency: ${key}`); return imports[key];
  } });
  return exports;
}
const paths = load('../lib/resume-path.ts', {});
function setup({ authenticated = true, path = 'resumes/synthetic/cv.pdf', available = true } = {}) {
  let reads = 0; let downloads = 0;
  const adapter = load('../lib/resume-download.ts', {
    'server-only': {}, 'next/server': { NextResponse },
    './storage': { createResumeDownloadUrl: async () => {
      downloads++; return available ? 'https://storage.example.test/signed-synthetic-cv' : null;
    } },
  });
  const route = load('../app/cms/admin/(desk)/applications/[id]/resume/route.ts', {
    'next/server': { NextResponse }, '@/lib/storage': paths,
    '@/lib/resume-download': adapter,
    '@/lib/auth/dal': { verifySession: async () => { if (!authenticated) throw new Error('Unauthorized'); } },
    '@/lib/prisma': { prisma: { application: { findUnique: async () => {
      reads++; return path ? { resumePath: path, resumeName: 'synthetic.pdf' } : null;
    } } } },
  });
  return { run: () => route.GET({}, { params: Promise.resolve({ id: 'synthetic' }) }), counts: () => ({ reads, downloads }) };
}
const denied = setup({ authenticated: false });
await assert.rejects(denied.run(), /Unauthorized/);
assert.deepEqual(denied.counts(), { reads: 0, downloads: 0 });
for (const path of [null, 'resumes/../invalid.pdf']) {
  const test = setup({ path });
  assert.equal((await test.run()).status, 404); assert.equal(test.counts().downloads, 0);
}
assert.equal((await setup({ available: false }).run()).status, 404);
const result = await setup().run();
assert.equal(result.status, 307);
assert.equal(result.headers.get('location'), 'https://storage.example.test/signed-synthetic-cv');
assert.equal(result.headers.get('cache-control'), 'private, no-store');
assert.equal(result.headers.get('x-content-type-options'), 'nosniff');
const r2 = async () => new Response('synthetic');
assert.equal(load('../lib/cloudflare/resume-download.ts', { './storage': { downloadResumeObject: r2 } }).resumeDownloadResponse, r2);
console.log('CV download authorization, missing files, signed redirect headers, and R2 adapter passed.');
