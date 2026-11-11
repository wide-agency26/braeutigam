#!/usr/bin/env node
/**
 * Scan public app styles/TSX for light-mode color literals and map to Figma tokens.
 * Usage: node scripts/generate-light-mode-audit.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "docs", "light-mode-audit.md");
const SKIP = ["/app/cms/", "/node_modules/", "typography-tokens.css"];

const TOKEN_MAP = {
  "#f0f0f0": "figma-page",
  "#1f2020": "figma-page-secondary / figma-text-body",
  "#131414": "figma-text-heading / figma-text-caption",
  "#009900": "figma-accent",
  "#00cc00": "figma-accent-subtle / figma-on-bright-accent",
  "#ff8800": "figma-orange",
  "#cc6d00": "figma-orange-subtle",
  "#717272": "figma-icon-muted",
  "#a1a1a1": "figma-button-bg",
  "#424343": "figma-button-bg-hover / figma-border-hover",
  "#00ff00": "figma-green / figma-border-secondary",
  "#087a08": "→ figma-accent (legacy)",
  "#f9f9fb": "→ figma-page (legacy)",
  "#111111": "→ figma-text-heading (legacy)",
  "#171717": "→ figma-text-heading (legacy)",
  "#39ff14": "dark-only brand-neon (keep in .dark)",
};

const HEX = /#(?:[0-9a-fA-F]{3,8})\b|rgba?\([^)]+\)/g;

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
  if (ent.isDirectory()) {
      if (ent.name === "cms") continue;
      walk(p, acc);
    } else if (/\.(css|tsx|jsx|ts)$/.test(ent.name)) {
      acc.push(p);
    }
  }
  return acc;
}

function rel(p) {
  return path.relative(ROOT, p);
}

const files = walk(path.join(ROOT, "app")).filter((f) => !SKIP.some((s) => f.includes(s)));
const rows = [];

for (const file of files) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (line.includes(".dark") && !line.includes(":not(.dark)")) return;
    const hits = line.match(HEX);
    if (!hits) return;
    const inLightBlock =
      line.includes(":root:not(.dark)") ||
      line.includes("var(--figma-") ||
      (!line.includes(".dark") && file.endsWith(".css"));
    for (const h of hits) {
      const normalized = h.toLowerCase();
      const token = TOKEN_MAP[normalized] ?? (line.includes("var(--figma") ? "token ref" : "unmapped / review");
      rows.push({
        file: rel(file),
        line: i + 1,
        value: h,
        token,
        note: inLightBlock ? "light context" : "shared or dark-default",
      });
    }
  });
}

const header = `# Light mode color audit

Figma: **U6PdyBS92GPjpwcznGYV7J** · node **2006-131**  
Canonical tokens: \`app/figma-light-scheme.css\`

| File | Line | Current | Figma token / note |
|------|------|---------|-------------------|
`;

const body = rows
  .map((r) => `| \`${r.file}\` | ${r.line} | \`${r.value}\` | ${r.token} (${r.note}) |`)
  .join("\n");

const footer = `

## Token reference (light)

| Token | Value |
|-------|-------|
| page | #f0f0f0 |
| page-secondary / body text | #1f2020 |
| heading / caption | #131414 |
| accent (headlines) | #009900 |
| accent-subtle (labels) | #00cc00 |
| orange / orange-subtle | #ff8800 / #cc6d00 |
| on-bright heading / accent | #f0f0f0 / #00cc00 |
| icons | #1f2020 / #717272 |
| button bg/hover, text/hover | #a1a1a1 / #424343, #f0f0f0 / #00cc00 |
| borders | hover #424343, secondary #00ff00 (hover #00cc00), tertiary #ff8800 |
| overlay | #1314144d |
| GREEEEN | #00ff00 |

## Unmapped (follow-up)

- Tailwind \`zinc-*\` on public TSX (home scrolly HUD, chrome) — not in Figma sheet; map to \`figma-icon-muted\` / \`figma-text-body\` incrementally.
- Contact hero photography shell stays dark legibility layer — content uses tokens above.
- Career watermark / display \`clamp()\` colors — decorative, not in token list.
`;

fs.writeFileSync(OUT, header + body + footer + "\n");
console.log(`Wrote ${OUT} (${rows.length} rows)`);
