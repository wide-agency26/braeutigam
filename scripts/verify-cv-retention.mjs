// Exercise the real route with isolated in-memory DB/storage dependencies.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const code = ts.transpileModule(readFileSync(new URL('../app/api/cron/purge-cvs/route.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
function setup({ environment = 'production', rows = [], fails = false } = {}) {
  const deleted = []; const files = []; let reads = 0; const routeModule = { exports: {} };
  const imports = {
    'next/server': { NextResponse: { json: (body, options) => ({ body, status: options?.status ?? 200 }) } },
    '@/lib/prisma': { prisma: { application: {
      findMany: async () => { reads++; return rows; },
      delete: async ({ where }) => deleted.push(where.id),
    } } },
    '@/lib/storage': {
      objectKeyFromStoredPath: path => path.startsWith('private/') ? path : null,
      deleteResumeObject: async key => { if (fails) throw new Error('Storage unavailable'); files.push(key); },
    },
  };
  vm.runInNewContext(code, { exports: routeModule.exports, require: key => {
    assert.ok(imports[key], `Unexpected dependency: ${key}`); return imports[key];
  }, process: { env: { VERCEL_ENV: environment, CRON_SECRET: 'local-only-test-secret' } }, console: { info() {} } });
  return { run: auth => routeModule.exports.GET({ headers: new Headers(auth ? { authorization: `Bearer ${auth}` } : {}) }), deleted, files, reads: () => reads };
}
for (const environment of ['preview', undefined]) {
  const test = setup({ environment: environment ?? 'cloudflare' });
  assert.equal((await test.run('local-only-test-secret')).status, 401); assert.equal(test.reads(), 0);
}
const denied = setup(); assert.equal((await denied.run('wrong')).status, 401); assert.equal(denied.reads(), 0);
const fixture = { id: 'synthetic', resumePath: 'private/synthetic.pdf' };
const failed = setup({rows:[fixture],fails:true});
assert.equal((await failed.run('local-only-test-secret')).status,503); assert.deepEqual(failed.deleted,[]);
const malformed = setup({rows:[{...fixture,resumePath:'unknown'}]});
assert.equal((await malformed.run('local-only-test-secret')).status,503); assert.deepEqual(malformed.deleted,[]);
const success = setup({rows:[fixture]});
assert.equal((await success.run('local-only-test-secret')).status,200); assert.deepEqual(success.deleted,['synthetic']); assert.deepEqual(success.files,['private/synthetic.pdf']);
console.log('Retention auth, environment guard, failed storage, malformed paths, and success passed.');
