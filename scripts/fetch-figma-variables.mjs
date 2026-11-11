#!/usr/bin/env node
/**
 * Merges Figma variable maps from scripts/data/figma-variables-mcp/*.json (per-node MCP exports)
 * into scripts/data/figma-variables-source.json light/dark color + dimension keys.
 *
 * Full file catalog (~199 modes): set FIGMA_ACCESS_TOKEN and run with --api to call
 * GET /v1/files/:fileKey/variables/local (Enterprise variables API).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MCP_DIR = path.join(ROOT, "scripts/data/figma-variables-mcp");
const SOURCE = path.join(ROOT, "scripts/data/figma-variables-source.json");
const FILE_KEY = "U6PdyBS92GPjpwcznGYV7J";

const HEX = /^#([0-9a-f]{3,8})$/i;
const DIM = /^\d+(\.\d+)?$/;

function isColor(v) {
  return HEX.test(String(v).trim());
}
function isDim(v) {
  return DIM.test(String(v).trim());
}

function loadMcpMerged() {
  if (!fs.existsSync(MCP_DIR)) return {};
  const merged = {};
  for (const f of fs.readdirSync(MCP_DIR).filter((n) => n.endsWith(".json"))) {
    const data = JSON.parse(fs.readFileSync(path.join(MCP_DIR, f), "utf8"));
    const vars = data.variables ?? data;
    Object.assign(merged, vars);
  }
  return merged;
}

async function fetchApi() {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    console.error("FIGMA_ACCESS_TOKEN not set; skipping API fetch.");
    return null;
  }
  const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/variables/local`, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) {
    console.error("Figma API error", res.status, await res.text());
    return null;
  }
  return res.json();
}

function pickColorAndDims(vars) {
  const out = {};
  for (const [key, raw] of Object.entries(vars)) {
    if (key.startsWith("Bräutigam/") || String(raw).startsWith("Font(")) continue;
    if (!raw || String(raw).trim() === "" || String(raw).trim() === ",") continue;
    if (isColor(raw) || isDim(raw)) out[key] = String(raw).trim();
  }
  return out;
}

async function main() {
  const source = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
  const mcpMerged = loadMcpMerged();

  if (process.argv.includes("--api")) {
    const api = await fetchApi();
    if (api?.meta?.variables) {
      const byMode = {};
      for (const v of Object.values(api.meta.variables)) {
        const name = v.name;
        // API returns variable IDs; resolved values need separate endpoint — document count only
        byMode[name] = v;
      }
      fs.writeFileSync(
        path.join(ROOT, "scripts/data/figma-variables-api-meta.json"),
        JSON.stringify({ count: Object.keys(byMode).length, sample: Object.keys(byMode).slice(0, 20) }, null, 2)
      );
      console.log(`API variable definitions: ${Object.keys(byMode).length}`);
    }
  }

  const lightExtra = pickColorAndDims(mcpMerged);
  source.light.variables = { ...source.light.variables, ...lightExtra };
  source.light.variables = pickColorAndDims(source.light.variables);

  const darkExtra = pickColorAndDims(
    Object.fromEntries(
      Object.entries(mcpMerged).filter(([k]) => source.dark.variables[k] !== undefined)
    )
  );
  source.dark.variables = { ...source.dark.variables, ...darkExtra };
  source.dark.variables = pickColorAndDims(source.dark.variables);

  delete source.light.variables["text/social/link"];
  delete source.dark.variables["text/social/link"];

  fs.writeFileSync(SOURCE, JSON.stringify(source, null, 2) + "\n");
  console.log(
    `Updated ${SOURCE}: light=${Object.keys(source.light.variables).length} dark=${Object.keys(source.dark.variables).length} keys`
  );
}

main();
