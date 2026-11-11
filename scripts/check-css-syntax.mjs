#!/usr/bin/env node
/**
 * Parse app CSS with PostCSS so broken var() / color-mix() fails lint before build.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP = path.join(ROOT, "app");

function walkCss(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkCss(p, out);
    else if (ent.name.endsWith(".css")) out.push(p);
  }
  return out;
}

function main() {
  const errors = [];
  for (const file of walkCss(APP)) {
    const rel = path.relative(ROOT, file);
    const css = fs.readFileSync(file, "utf8");
    try {
      postcss.parse(css, { from: file });
    } catch (e) {
      errors.push(`${rel}: ${e.message}`);
    }
  }
  if (errors.length) {
    console.error("CSS syntax check failed:\n" + errors.join("\n"));
    process.exit(1);
  }
  console.log("check-css-syntax: OK");
}

main();
