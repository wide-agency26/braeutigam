#!/usr/bin/env node
/**
 * Generates app/figma-tokens.css + public/figma-tokens.css from scripts/data/figma-variables-source.json
 * Dark *applied* values: Figma 934:241 merged with scripts/data/dark-production-snapshot.json until Ali approves flip.
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

  const lightLines = buildBlock(source.light.variables);
  const darkFigma = { ...source.dark.variables };
  const darkApplied = applyCssOverridesToFigma(darkFigma, darkSnap.cssVarOverrides || {});
  const darkLines = buildBlock(darkApplied);

  const header = `/**
 * Figma design tokens — file ${source.fileKey}
 * Light: node ${source.light.nodeId} (${source.light.nodeName})
 * Dark (Figma source 934:241): applied values may differ — see docs/figma-tokens.md § Pending dark decisions
 * Regenerate: pnpm sync:figma-tokens
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
    ...(darkSnap.semanticDark
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
    let appliedDark = darkApplied[key] ?? "—";
    const override = darkSnap.cssVarOverrides?.[cssName];
    if (override && figmaDark !== "—" && isColorValue(figmaDark)) {
      appliedDark = `${appliedDark} (snapshot)`;
    }
    tableRows.push(
      `| \`${key}\` | ${derivedCollection(key)} | \`${cssName}\` | ${raw} | ${figmaDark} | ${appliedDark} |`
    );
  }

  const pending = (darkSnap.pendingDarkDecisions || [])
    .map(
      (r) =>
        `| \`${r.figmaKey}\` | \`${r.cssVar}\` | ${r.figmaValue} | ${r.appliedValue} | ${r.usedIn} |`
    )
    .join("\n");

  const doc = `# Figma tokens

Source: [\`scripts/data/figma-variables-source.json\`](../scripts/data/figma-variables-source.json)  
MCP node dumps: [\`scripts/data/figma-variables-mcp/\`](../scripts/data/figma-variables-mcp/)  
Full library export: \`FIGMA_ACCESS_TOKEN=… node scripts/fetch-figma-variables.mjs --api\`

Regenerate CSS: \`pnpm sync:figma-tokens\`

Color + dimension keys in source: light **${Object.keys(source.light.variables).length}**, dark Figma **${Object.keys(source.dark.variables).length}** (target: full file catalog ~199 via Variables API).

## Variable map

| Figma variable | Collection | CSS name | Light | Dark (Figma) | Dark (applied) |
|----------------|------------|----------|-------|--------------|----------------|
${tableRows.join("\n")}

## Pending dark decisions

Figma dark home **934:241** is documented below; **production dark unchanged** until explicitly approved.

| Figma variable | CSS name | Figma (934:241) | Applied (now) | Used in |
|----------------|----------|-----------------|---------------|---------|
${pending}

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
