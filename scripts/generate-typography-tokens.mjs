#!/usr/bin/env node
/**
 * Typography from scripts/data/figma-type-styles.json (Figma variables + one-off nodes).
 * Scale: calc(N * min(100vw, 1920px) / 1920), cap at Npx @ >=1920.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DESIGN_WIDTH, scaleCalc, scaleLetterSpacing, scaleLineHeight, scalePx } from "./lib/figma-scale.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(ROOT, "scripts/data/figma-type-styles.json");

const FLOORS = {
  body: 14,
  tiny: 10,
  heading: null,
  deco: null,
};

/** @param {import('./data/figma-type-styles.json').styles[0]} t */
function renderToken(t) {
  const floor = t.floor ? FLOORS[t.floor] : null;
  const fsCss =
    floor != null
      ? scalePx(t.size, { floorPx: floor, capPx: t.size })
      : scalePx(t.size, { capPx: t.size });

  let lhCss;
  if (t.lh.kind === "ratio") {
    lhCss = scaleLineHeight(t.size, t.lh);
  } else if (t.floor === "body" || t.floor === "tiny") {
    lhCss = scalePx(t.lh.value, {
      floorPx: t.floor === "tiny" ? 10 : 14,
      capPx: t.lh.value,
    });
  } else {
    lhCss = scalePx(t.lh.value, { capPx: t.lh.value });
  }

  const lsCss = scaleLetterSpacing(t.ls);

  const lines = [
    `.${t.id} {`,
    `  margin: 0;`,
    `  font-family: ${t.ff};`,
    `  font-weight: ${t.fw};`,
    `  font-size: ${fsCss};`,
    `  line-height: ${lhCss};`,
    `  letter-spacing: ${lsCss};`,
  ];
  if (t.caps) lines.push(`  text-transform: uppercase;`);
  if (t.sourceNode) lines.push(`  /* Figma node ${t.sourceNode} */`);
  lines.push(`}`);
  return lines.join("\n");
}

/** @param {import('./data/figma-type-styles.json').styles[0]} t @param {{ class: string, ls: { kind: string, value: number } }} mod */
function renderModifier(t, mod) {
  const lsCss = scaleLetterSpacing(mod.ls);
  return [
    `.${mod.class} {`,
    `  letter-spacing: ${lsCss};`,
    `  /* modifier of .${t.id} — Figma override */`,
    `}`,
  ].join("\n");
}

function main() {
  const data = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
  const all = [...data.styles, ...(data.oneOff ?? [])];

  const blocks = [];
  for (const t of all) {
    blocks.push(renderToken(t));
    for (const mod of t.modifiers ?? []) {
      blocks.push(renderModifier(t, mod));
    }
  }

  const header = `/**
 * Figma typography — ${DESIGN_WIDTH}px base: ${scaleCalc(1).replace(/calc\(1 /, "calc(N ")}
 * Regenerate: pnpm sync:typography
 * Source: scripts/data/figma-type-styles.json (from get_variable_defs + node one-offs)
 */

`;

  const css = header + blocks.join("\n\n") + "\n";

  for (const rel of ["app/typography-tokens.css", "public/typography-tokens.css"]) {
    fs.writeFileSync(path.join(ROOT, rel), css);
  }
  console.log("Wrote", all.length, "typography classes");
}

main();
