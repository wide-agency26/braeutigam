#!/usr/bin/env node
/**
 * Generates app/figma-tokens.css + public/figma-tokens.css from scripts/data/figma-variables-source.json
 * Dark production mismatches come from scripts/data/dark-production-snapshot.json
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
function buildBlock(vars, { pxDims = false } = {}) {
  const lines = [];
  const keys = Object.keys(vars).sort();
  for (const key of keys) {
    const raw = vars[key];
    if (!raw || String(raw).trim() === "") continue;
    const name = figmaKeyToCssVar(key);
    if (isColorValue(raw)) {
      lines.push(`  ${name}: ${raw.toLowerCase()};`);
    } else if (isDimensionValue(raw)) {
      lines.push(`  ${name}: ${pxDims ? `${raw}px` : `${raw}px`};`);
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
    "  --surface-muted: var(--surface-pages-page);",
    "  --focus-ring: var(--text-default-accent);",
    "  --color-brand-neon: var(--colors-greeeen);",
    "  --social-link: var(--text-social-link);",
  ];
}

function main() {
  const source = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
  const darkSnap = JSON.parse(fs.readFileSync(DARK_SNAP, "utf8"));

  const lightLines = buildBlock(source.light.variables);
  const darkVars = { ...source.dark.variables };
  for (const figmaKey of Object.keys(darkVars)) {
    const cssName = figmaKeyToCssVar(figmaKey);
    if (darkSnap.cssVarOverrides?.[cssName]) {
      darkVars[figmaKey] = darkSnap.cssVarOverrides[cssName];
    }
  }

  const darkLines = buildBlock(darkVars);
  const darkOverrideLines = Object.entries(darkSnap.cssVarOverrides || {})
    .filter(([name]) => !darkLines.some((l) => l.startsWith(`  ${name}:`)))
    .map(([name, value]) => `  ${name}: ${value};`);

  const header = `/**
 * Figma design tokens — file ${source.fileKey}
 * Light: node ${source.light.nodeId} (${source.light.nodeName})
 * Dark: merged from nodes ${source.dark.nodeIds.join(", ")}
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
    ...darkOverrideLines,
    "",
    ...(darkSnap.semanticDark
      ? Object.entries(darkSnap.semanticDark).map(([k, v]) => `  ${k}: ${v};`)
      : []),
    "  --color-brand-neon: var(--colors-greeeen);",
    "}\n",
  ].join("\n");

  fs.mkdirSync(path.dirname(OUT_APP), { recursive: true });
  fs.writeFileSync(OUT_APP, css);
  fs.writeFileSync(OUT_PUBLIC, css);

  const tableRows = [];
  for (const key of Object.keys(source.light.variables).sort()) {
    const raw = source.light.variables[key];
    if (!isColorValue(raw) && !isDimensionValue(raw)) continue;
    const cssName = figmaKeyToCssVar(key);
    const darkRaw = source.dark.variables[key];
    let darkApplied = darkRaw && isColorValue(darkRaw) ? darkRaw : "—";
    const override = darkSnap.cssVarOverrides?.[cssName];
    if (override) darkApplied = `${override} (snapshot)`;
    tableRows.push(
      `| \`${key}\` | ${derivedCollection(key)} | \`${cssName}\` | ${raw} | ${darkApplied} | |`
    );
  }

  const doc = `# Figma tokens

Source: [\`scripts/data/figma-variables-source.json\`](../scripts/data/figma-variables-source.json)

Regenerate CSS: \`pnpm sync:figma-tokens\`

## Variable map

| Figma variable | Collection | CSS name | Light | Dark (applied) | Used in |
|----------------|------------|----------|-------|----------------|---------|
${tableRows.join("\n")}

## Pending dark decisions

${(darkSnap.pendingDarkDecisions || [])
  .map(
    (r) =>
      `- **${r.figmaKey}** (\`${r.cssVar}\`): Figma \`${r.figmaValue}\` → applied \`${r.appliedValue}\` — ${r.usedIn}`
  )
  .join("\n")}

## Non-exportable (Figma)

${(source.nonExportable || []).map((k) => `- \`${k}\``).join("\n")}

## Non-color variables

Scale and Border Sizes tokens are emitted as \`--scale-*\` and \`--border-sizes-*\` with \`px\` units.
`;

  fs.mkdirSync(path.dirname(OUT_DOC), { recursive: true });
  fs.writeFileSync(OUT_DOC, doc);
  console.log(`Wrote ${OUT_APP}`);
}

main();
