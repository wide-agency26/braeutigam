import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

// Require an explicit target; never infer a client's account from a personal login.
if (!/^[a-f0-9]{32}$/i.test(process.env.CLOUDFLARE_ACCOUNT_ID ?? '')) {
  throw new Error('Set CLOUDFLARE_ACCOUNT_ID to the verified owner account before deployment.');
}
if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(process.env.CLOUDFLARE_D1_ID ?? '')) {
  throw new Error('Set CLOUDFLARE_D1_ID to the verified EU staging database ID before deployment.');
}
const secretFile = process.env.CLOUDFLARE_SECRETS_FILE;
if (!secretFile) throw new Error('Set CLOUDFLARE_SECRETS_FILE to a protected JSON file containing a fresh SESSION_SECRET.');
let secrets;
try { secrets = JSON.parse(await readFile(secretFile, 'utf8')); }
catch { throw new Error('The deployment secret file must be readable, valid JSON.'); }
if (typeof secrets.SESSION_SECRET !== 'string' || secrets.SESSION_SECRET.length < 32) {
  throw new Error('The deployment secret file must contain a SESSION_SECRET of at least 32 characters.');
}
if (Object.keys(secrets).some((key) => key !== 'SESSION_SECRET')) {
  throw new Error('Only SESSION_SECRET is needed; remove unrelated credentials from the deployment secret file.');
}
const result = spawnSync('pnpm', ['exec', 'cf', 'deploy', '--no-provision', '--secrets-file', secretFile], { stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
