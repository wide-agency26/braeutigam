#!/usr/bin/env node
/**
 * Generates app/figma-tokens.css + public/figma-tokens.css from scripts/data/figma-variables-source.json
 * Light: Figma 2006:131. Dark: Figma 934:241 (exact).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(ROOT, "scripts/data/figma-variables-source.json");
const DARK_SNAP = path.join(ROOT, "scripts/data/dark-production-snapshot.json");
const OUT_APP = path.join(ROOT, "app/figma-tokens.css");
const OUT_PUBLIC = path.join(ROOT, "public/figma-tokens.css");
const OUT_DOC = path.join(ROOT, "docs/figma-tokens.md");
const MISSING_DOC = path.join(ROOT, "docs/figma-missing-variables.md");

const MODE_SPLIT_KEYS = [
  "surface/pages/page",
  "text/default/heading",
  "text/default/body",
  "text/on-bright/heading",
];

/** @param {Record<string, string>} light @param {Record<string, string>} dark */
function assertLightDarkDiffer(light, dark) {
  const failures = [];
  for (const key of MODE_SPLIT_KEYS) {
    const lv = light[key];
    const dv = dark[key];
    if (!lv || !dv) {
      failures.push(`${key}: missing (light=${lv ?? "—"}, dark=${dv ?? "—"})`);
      continue;
    }
    if (lv.toLowerCase() === dv.toLowerCase()) {
      failures.push(`${key}: light and dark both ${lv} — modes may be cross-merged`);
    }
  }
  if (failures.length) {
    console.error("Figma token mode split check failed:\n" + failures.map((f) => `  - ${f}`).join("\n"));
    console.error("Run: node scripts/fetch-figma-variables.mjs && pnpm sync:figma-tokens");
    process.exit(1);
  }
}

/** @param {string} key */
function figmaKeyToCssVar(key) {
  return (
    "--" +
    key
      .replace(/,\s*/g, "-")
      .replace(/\//g, "-")
      .replace(/\s+/g, "-")
      .replace(/,/g, "")
      .toLowerCase()
  );
}

/** @param {string} v */
function isColorValue(v) {
  return /^#([0-9a-f]{3,8})$/i.test(v.trim());
}

/** @param {string} v */
function isDimensionValue(v) {
  return /^\d+(\.\d+)?$/.test(String(v).trim());
}

/** @param {string} key */
function derivedCollection(key) {
  const slash = key.indexOf("/");
  const head = slash >= 0 ? key.slice(0, slash) : key;
  if (head.startsWith("Scale")) return "Scale";
  if (head.startsWith("Border Sizes")) return "Border Sizes";
  if (head === "Neutral" || head.startsWith("Brand Colors")) return head;
  if (head === "Colors" || head === "Color") return "Colors";
  return head;
}

/** @param {Record<string, string>} vars */
function buildBlock(vars) {
  const lines = [];
  for (const key of Object.keys(vars).sort()) {
    const raw = vars[key];
    if (!raw || String(raw).trim() === "") continue;
    const name = figmaKeyToCssVar(key);
    if (isColorValue(raw)) {
      lines.push(`  ${name}: ${raw.toLowerCase()};`);
    } else if (isDimensionValue(raw)) {
      lines.push(`  ${name}: ${raw}px;`);
    }
  }
  return lines;
}

function semanticAliases() {
  return [
    "  /* Semantic aliases (no hex) */",
    "  --background: var(--surface-pages-page);",
    "  --foreground: var(--text-default-heading);",
    "  --surface: var(--surface-pages-page);",
    "  --surface-muted: var(--surface-pages-page-secondary);",
    "  --focus-ring: var(--colors-greeeen);",
    "  --color-brand-neon: var(--colors-greeeen);",
  ];
}

/** @param {Record<string, string>} darkVars @param {Record<string, string>} overrides */
function applyCssOverridesToFigma(darkVars, overrides) {
  const applied = { ...darkVars };
  for (const [cssVar, value] of Object.entries(overrides)) {
    let hit = false;
    for (const key of Object.keys(applied)) {
      if (figmaKeyToCssVar(key) === cssVar) {
        applied[key] = value;
        hit = true;
      }
    }
    if (!hit) {
      const synthetic = cssVar.replace(/^--/, "").replace(/-/g, "/");
      applied[synthetic] = value;
    }
  }
  return applied;
}

function main() {
  const source = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
  const darkSnap = JSON.parse(fs.readFileSync(DARK_SNAP, "utf8"));

  assertLightDarkDiffer(source.light.variables, source.dark.variables);

  const lightLines = buildBlock(source.light.variables);
  const darkFigma = { ...source.dark.variables };
  const darkApplied = applyCssOverridesToFigma(darkFigma, darkSnap.cssVarOverrides || {});
  const darkLines = buildBlock(darkApplied);

  const header = `/**
 * Figma design tokens — file ${source.fileKey}
 * Light: node ${source.light.nodeId} (${source.light.nodeName}) — Figma 2006:131
 * Dark: Figma 934:241 (${source.dark.nodeName})
 * Regenerate: node scripts/fetch-figma-variables.mjs && pnpm sync:figma-tokens
 */\n`;

  const css = [
    header,
    ":root {",
    ...lightLines,
    "",
    ...semanticAliases(),
    "}\n",
    ".dark {",
    ...darkLines,
    "",
    ...(darkSnap.semanticDark && Object.keys(darkSnap.semanticDark).length
      ? Object.entries(darkSnap.semanticDark).map(([k, v]) => `  ${k}: ${v};`)
      : []),
    ...semanticAliases(),
    "}\n",
  ].join("\n");

  fs.writeFileSync(OUT_APP, css);
  fs.writeFileSync(OUT_PUBLIC, css);

  const tableRows = [];
  const allKeys = new Set([
    ...Object.keys(source.light.variables),
    ...Object.keys(source.dark.variables),
  ]);
  for (const key of [...allKeys].sort()) {
    const raw = source.light.variables[key];
    if (!raw || (!isColorValue(raw) && !isDimensionValue(raw))) continue;
    const cssName = figmaKeyToCssVar(key);
    const figmaDark = source.dark.variables[key] ?? "—";
    const appliedDark = darkApplied[key] ?? "—";
    tableRows.push(
      `| \`${key}\` | ${derivedCollection(key)} | \`${cssName}\` | ${raw} | ${figmaDark} | ${appliedDark} |`
    );
  }

  const doc = `# Figma tokens

**Policy:** light follows Figma **2006:131** exactly; dark follows Figma **934:241** exactly (\`:root\` vs \`.dark\` in \`app/figma-tokens.css\`).

Source: [\`scripts/data/figma-variables-source.json\`](../scripts/data/figma-variables-source.json)  
MCP node dumps (split by mode): [\`scripts/data/figma-variables-mcp/\`](../scripts/data/figma-variables-mcp/)  
Refresh source from MCP: \`node scripts/fetch-figma-variables.mjs\`  
Full library export: \`FIGMA_ACCESS_TOKEN=… node scripts/fetch-figma-variables.mjs --api\`

Regenerate CSS: \`pnpm sync:figma-tokens\` (fails if light/dark share page, heading, body, or on-bright heading values)

Color + dimension keys: light **${Object.keys(source.light.variables).length}**, dark **${Object.keys(source.dark.variables).length}**.

## Variable map

| Figma variable | Collection | CSS name | Light (2006:131) | Dark (934:241) | Dark (applied) |
|----------------|------------|----------|------------------|----------------|----------------|
${tableRows.join("\n")}

## Missing Figma variables

See [\`figma-missing-variables.md\`](figma-missing-variables.md).

## Non-exportable (Figma)

${(source.nonExportable || []).map((k) => `- \`${k}\``).join("\n")}
`;

  const missing = `# Missing Figma variables

| UI usage | Observed value | Nearest token | Notes |
|----------|----------------|---------------|--------|
| Social section link text (light home \`2006:790\`) | \`#b2b1b2\` | \`icon/default/placeholder\` (\`#717272\`) | No library variable; using \`--icon-default-placeholder\` in CSS until token exists |
`;

  fs.writeFileSync(OUT_DOC, doc);
  fs.writeFileSync(MISSING_DOC, missing);
  console.log(`Wrote ${OUT_APP}`);
}

main();
