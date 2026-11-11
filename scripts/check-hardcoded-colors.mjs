#!/usr/bin/env node
/**
 * Fail CI when app code uses raw hex/rgb colors outside allowlisted paths.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP = path.join(ROOT, "app");
const ALLOW_FILES = new Set([path.join(APP, "figma-tokens.css")]);
const EXCEPTIONS_DOC = path.join(ROOT, "docs/color-exceptions.md");

/** @returns {string[]} */
function loadAllowedPaths() {
  if (!fs.existsSync(EXCEPTIONS_DOC)) return [];
  const text = fs.readFileSync(EXCEPTIONS_DOC, "utf8");
  const paths = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^-\s+`(app\/[^`]+)`/);
    if (!m) continue;
    const rel = m[1];
    if (rel.endsWith("/**")) {
      paths.push({
        type: "prefix",
        value: path.join(ROOT, rel.slice(0, -3)),
      });
    } else {
      paths.push({ type: "file", value: path.join(ROOT, rel) });
    }
  }
  return paths;
}

const HEX = /#[0-9a-f]{3,8}\b/gi;
const RGB = /\brgba?\s*\(/gi;

/** @param {string} dir */
function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(css|tsx|ts|jsx|js)$/.test(ent.name)) out.push(p);
  }
  return out;
}

function isAllowed(file, allowed) {
  if (ALLOW_FILES.has(file)) return true;
  for (const rule of allowed) {
    if (rule.type === "file" && file === rule.value) return true;
    if (rule.type === "prefix" && file.startsWith(rule.value + path.sep)) return true;
  }
  return false;
}

function main() {
  const allowed = loadAllowedPaths();
  const violations = [];
  for (const file of walk(APP)) {
    if (isAllowed(file, allowed)) continue;
    const rel = path.relative(ROOT, file);
    const text = fs.readFileSync(file, "utf8");
    const lines = text.split("\n");
    lines.forEach((line, i) => {
      if (line.includes("eslint-disable") && line.includes("color")) return;
      if (line.includes("readCssVarColor(")) return;
      if (line.includes('memberId = "#000-000"')) return;
      if (HEX.test(line) || RGB.test(line)) {
        HEX.lastIndex = 0;
        RGB.lastIndex = 0;
        violations.push(`${rel}:${i + 1}: ${line.trim().slice(0, 120)}`);
      }
    });
  }

  if (violations.length) {
    console.error(
      `Hardcoded color check failed (${violations.length} lines). Use figma-tokens.css vars or add docs/color-exceptions.md allowlist.\n`
    );
    console.error(violations.slice(0, 40).join("\n"));
    if (violations.length > 40) console.error(`… and ${violations.length - 40} more`);
    process.exit(1);
  }
  console.log("check-hardcoded-colors: OK");
}

main();
