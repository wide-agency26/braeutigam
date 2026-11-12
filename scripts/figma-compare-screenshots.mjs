#!/usr/bin/env node
/**
 * Regenerate light/dark screenshots after a design pass.
 * Requires dev server: pnpm dev (or pass --base URL).
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const child = spawn("node", [path.join(ROOT, "scripts/light-mode-screenshots.mjs"), ...process.argv.slice(2)], {
  stdio: "inherit",
  cwd: ROOT,
});

child.on("exit", (code) => process.exit(code ?? 0));
