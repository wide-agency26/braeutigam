#!/usr/bin/env node
/**
 * Run full figma:qa against a protected Vercel preview (GET only).
 * Sets VERCEL_PROTECTION_BYPASS from `vercel curl -v` without printing the secret.
 */
import { execSync, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function extractBypass(previewUrl) {
  const verbose = execSync(`vercel curl -v "${previewUrl}/" 2>&1`, {
    encoding: "utf8",
    maxBuffer: 10e6,
    cwd: ROOT,
  });
  const m = verbose.match(/>\s*x-vercel-protection-bypass:\s*(\S+)/);
  return m?.[1]?.trim();
}

const preview = process.argv[2];
if (!preview) {
  console.error("Usage: node scripts/figma-qa-on-preview.mjs <preview-url> [-- figma:qa args]");
  process.exit(1);
}

const bypass = extractBypass(preview);
if (!bypass) {
  console.error("Could not extract protection bypass from vercel curl");
  process.exit(1);
}

const extra = process.argv.slice(3);
const qaArgs = ["figma:qa", "--base", preview, ...extra];
const r = spawnSync("pnpm", qaArgs, {
  cwd: ROOT,
  env: { ...process.env, VERCEL_PROTECTION_BYPASS: bypass },
  stdio: "inherit",
});
process.exit(r.status ?? 1);
