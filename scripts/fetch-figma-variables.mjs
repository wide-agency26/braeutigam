#!/usr/bin/env node
/**
 * Merges Figma variable maps from scripts/data/figma-variables-mcp/*.json into
 * scripts/data/figma-variables-source.json — light and dark NEVER share a merge pool.
 *
 * Light: 2006-131.json + light-*.json (+ optional mode: "light" in dump metadata)
 * Dark:  934-241.json + dark-*.json (+ optional mode: "dark")
 *
 * Full file catalog (~199 modes): FIGMA_ACCESS_TOKEN + --api
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MCP_DIR = path.join(ROOT, "scripts/data/figma-variables-mcp");
const SOURCE = path.join(ROOT, "scripts/data/figma-variables-source.json");
const FILE_KEY = "U6PdyBS92GPjpwcznGYV7J";

const LIGHT_ANCHORS = new Set(["2006-131.json"]);
const DARK_ANCHORS = new Set(["934-241.json"]);

const HEX = /^#([0-9a-f]{3,8})$/i;
const DIM = /^\d+(\.\d+)?$/;

function isColor(v) {
  return HEX.test(String(v).trim());
}
function isDim(v) {
  return DIM.test(String(v).trim());
}

/** @param {"light" | "dark"} mode */
function fileMode(filename, data) {
  if (data?.mode === "light" || data?.mode === "dark") return data.mode;
  if (LIGHT_ANCHORS.has(filename) || /^light-/i.test(filename)) return "light";
  if (DARK_ANCHORS.has(filename) || /^dark-/i.test(filename)) return "dark";
  const nodeId = String(data?.nodeId ?? "");
  if (nodeId.startsWith("2006:")) return "light";
  if (nodeId === "934:241" || nodeId.startsWith("934:")) return "dark";
  return null;
}

/** @param {"light" | "dark"} mode */
function loadMcpForMode(mode) {
  if (!fs.existsSync(MCP_DIR)) return {};
  const merged = {};
  for (const filename of fs.readdirSync(MCP_DIR).filter((n) => n.endsWith(".json"))) {
    const data = JSON.parse(fs.readFileSync(path.join(MCP_DIR, filename), "utf8"));
    const m = fileMode(filename, data);
    if (m !== mode) continue;
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
    const s = String(raw).trim();
    if (s.endsWith(",")) continue;
    if (isColor(s) || isDim(s)) out[key] = s.toLowerCase();
  }
  return out;
}

async function main() {
  const source = JSON.parse(fs.readFileSync(SOURCE, "utf8"));

  if (process.argv.includes("--api")) {
    const api = await fetchApi();
    if (api?.meta?.variables) {
      const byMode = {};
      for (const v of Object.values(api.meta.variables)) {
        byMode[v.name] = v;
      }
      fs.writeFileSync(
        path.join(ROOT, "scripts/data/figma-variables-api-meta.json"),
        JSON.stringify({ count: Object.keys(byMode).length, sample: Object.keys(byMode).slice(0, 20) }, null, 2)
      );
      console.log(`API variable definitions: ${Object.keys(byMode).length}`);
    }
  }

  const lightMerged = loadMcpForMode("light");
  const darkMerged = loadMcpForMode("dark");

  if (!Object.keys(lightMerged).length) {
    console.error("No light MCP dumps found (expected scripts/data/figma-variables-mcp/2006-131.json)");
    process.exit(1);
  }
  if (!Object.keys(darkMerged).length) {
    console.error("No dark MCP dumps found (expected scripts/data/figma-variables-mcp/934-241.json)");
    process.exit(1);
  }

  source.light.variables = pickColorAndDims(lightMerged);
  source.dark.variables = pickColorAndDims(darkMerged);

  delete source.light.variables["text/social/link"];
  delete source.dark.variables["text/social/link"];

  source.notes = {
    ...source.notes,
    darkPolicy: "Light = Figma 2006:131; dark = Figma 934:241 (exact in .dark)",
    mcpSplit: "Light/dark merged only within their own MCP file sets — never cross-mode",
  };

  fs.writeFileSync(SOURCE, JSON.stringify(source, null, 2) + "\n");
  console.log(
    `Updated ${SOURCE}: light=${Object.keys(source.light.variables).length} dark=${Object.keys(source.dark.variables).length} keys`
  );
}

main();
