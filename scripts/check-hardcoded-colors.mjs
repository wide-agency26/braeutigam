#!/usr/bin/env node
/**
 * Fail when app code uses raw hex/rgb outside figma-tokens.css and line allowlist in docs/color-exceptions.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP = path.join(ROOT, "app");
const ALLOW_FILES = new Set([path.join(APP, "figma-tokens.css")]);
const EXCEPTIONS_DOC = path.join(ROOT, "docs/color-exceptions.md");

/** @returns {Map<string, Set<number>>} */
function loadLineExceptions() {
  const map = new Map();
  if (!fs.existsSync(EXCEPTIONS_DOC)) return map;
  for (const line of fs.readFileSync(EXCEPTIONS_DOC, "utf8").split("\n")) {
    const m = line.match(/^-\s+`(app\/[^`]+):(\d+)`\s+[—-]\s+/);
    if (!m) continue;
    const file = path.join(ROOT, m[1]);
    const ln = Number(m[2]);
    if (!map.has(file)) map.set(file, new Set());
    map.get(file).add(ln);
  }
  return map;
}

const HEX = /#[0-9a-f]{3,8}\b/gi;
const RGB = /\brgba?\s*\(/gi;

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(css|tsx|ts|jsx|js)$/.test(ent.name)) out.push(p);
  }
  return out;
}

function main() {
  const lineEx = loadLineExceptions();
  const violations = [];
  for (const file of walk(APP)) {
    if (ALLOW_FILES.has(file)) continue;
    if (file.includes(`${path.sep}cms${path.sep}`)) continue;
    const rel = path.relative(ROOT, file);
    const allowedLines = lineEx.get(file) ?? new Set();
    const lines = fs.readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      const ln = i + 1;
      if (allowedLines.has(ln)) return;
      if (line.includes("readCssVarColor(")) return;
      if (line.includes('memberId = "#000-000"')) return;
      if (HEX.test(line) || RGB.test(line)) {
        HEX.lastIndex = 0;
        RGB.lastIndex = 0;
        violations.push(`${rel}:${ln}: ${line.trim().slice(0, 120)}`);
      }
    });
  }

  if (violations.length) {
    console.error(
      `Hardcoded color check failed (${violations.length} lines). Add per-line allowlist in docs/color-exceptions.md or use tokens.\n`
    );
    console.error(violations.slice(0, 50).join("\n"));
    if (violations.length > 50) console.error(`… and ${violations.length - 50} more`);
    process.exit(1);
  }
  console.log("check-hardcoded-colors: OK");
}

main();
