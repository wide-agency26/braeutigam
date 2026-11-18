import { readFile, readdir } from 'node:fs/promises';

// Only the local emulator is accepted. This script cannot target a live D1 API.
const base = 'http://127.0.0.1:3008/cdn-cgi/local/explorer/api';
async function api(path, body) {
  const response = await fetch(`${base}${path}`, body ? {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  } : undefined);
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error(JSON.stringify(result.errors));
  return result.result;
}
const databases = await api('/d1/database');
const database = databases.find((item) => item.name === 'DB');
if (!database) throw new Error('Start pnpm cf:preview (or cf:dev) with the staging configuration first.');
const query = (body) => api(`/d1/database/${encodeURIComponent(database.uuid)}/raw`, body);
await query({ sql: 'CREATE TABLE IF NOT EXISTS d1_migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)' });
const [applied] = await query({ sql: 'SELECT name FROM d1_migrations' });
const names = new Set(applied.results.rows.map(([name]) => name));
for (const name of (await readdir('migrations')).filter((name) => name.endsWith('.sql')).sort()) {
  if (names.has(name)) continue;
  await query({ batch: [
    { sql: await readFile(`migrations/${name}`, 'utf8') },
    { sql: 'INSERT INTO d1_migrations (name) VALUES (?)', params: [name] },
  ] });
  console.log(`Applied locally: ${name}`);
}
if (process.argv[2]) {
  const batch = JSON.parse(await readFile(process.argv[2], 'utf8'));
  await query({ batch });
  console.log(`Applied ${batch.length} local fixture statements.`);
}
