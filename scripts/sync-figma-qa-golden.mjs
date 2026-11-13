#!/usr/bin/env node
/**
 * Record sha256 fingerprints for committed golden assets (icons / overlays).
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GOLDEN = path.join(ROOT, "public/figma-qa/golden");
const MANIFEST = path.join(ROOT, "scripts/data/figma-qa-assets.json");

function hashFile(p) {
  const buf = fs.readFileSync(p);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function walk(dir, base = "") {
  /** @type {Record<string, string>} */
  const out = {};
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = path.join(base, name);
    if (fs.statSync(full).isDirectory()) {
      Object.assign(out, walk(full, rel));
    } else {
      out[rel.replace(/\\/g, "/")] = hashFile(full);
    }
  }
  return out;
}

const hashes = walk(GOLDEN);
const spec = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
spec.sha256 = hashes;
spec.updatedAt = new Date().toISOString();
fs.writeFileSync(MANIFEST, `${JSON.stringify(spec, null, 2)}\n`);
console.log(`Updated ${Object.keys(hashes).length} golden fingerprints in figma-qa-assets.json`);
