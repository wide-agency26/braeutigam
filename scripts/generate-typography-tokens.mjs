#!/usr/bin/env node
/**
 * Generates app/ + public/ typography-tokens.css — proportional scale, no 1440 cap.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** @type {{ id: string, props: { size?: number, lh?: number, ls?: number, fw?: number, ff: string, caps?: boolean, copyFloor14?: boolean, tiny?: boolean, lhFlag?: number } }[]} */
const TOKENS = [
  {
    id: "heading-primary-bold",
    props: {
      ff: "var(--font-univers-bold-cn), sans-serif",
      fw: 700,
      size: 100,
      lh: 100,
      ls: 0,
      caps: true,
      deco: true,
    },
  },
  {
    id: "heading-secondary",
    props: {
      ff: "var(--font-univers-cn), sans-serif",
      fw: 400,
      size: 76,
      lh: 52,
      ls: -2,
      caps: true,
      deco: true,
    },
  },
  {
    id: "heading-secondary-bold",
    props: {
      ff: "var(--font-univers-bold-cn), sans-serif",
      fw: 700,
      size: 76,
      lh: 76,
      ls: -2,
      caps: true,
      deco: true,
    },
  },
  {
    id: "heading-tertiary",
    props: {
      ff: "var(--font-univers-cn), sans-serif",
      fw: 400,
      size: 57,
      lh: 57,
      ls: 0,
      caps: true,
      deco: true,
    },
  },
  {
    id: "decorative-primary",
    props: {
      ff: "var(--font-bootzy), sans-serif",
      fw: 400,
      size: 332,
      lh: 232,
      ls: 8,
      caps: true,
      deco: true,
    },
  },
  {
    id: "decorative-secondary",
    props: {
      ff: "var(--font-bootzy), sans-serif",
      fw: 400,
      size: 72,
      lh: 84,
      ls: 4,
      caps: true,
      deco: true,
    },
  },
  {
    id: "decorative-tertiary",
    props: {
      ff: "var(--font-bootzy), sans-serif",
      fw: 400,
      size: 42,
      lh: 48,
      ls: 2,
      caps: true,
      deco: true,
    },
  },
  {
    id: "copy-body-lg",
    props: {
      ff: "var(--font-univers), sans-serif",
      fw: 400,
      size: 28,
      lh: 38,
      ls: 0,
      copy: true,
    },
  },
  {
    id: "copy-body",
    props: {
      ff: "var(--font-univers), sans-serif",
      fw: 400,
      size: 20,
      lh: 24,
      ls: 0,
      copy: true,
    },
  },
  {
    id: "copy-body-sm",
    props: {
      ff: "var(--font-jetbrains-mono), monospace",
      fw: 400,
      size: 14,
      lh: 18,
      ls: 0,
      copy: true,
    },
  },
  {
    id: "copy-caption",
    props: {
      ff: "var(--font-jetbrains-mono), monospace",
      fw: 400,
      size: 12,
      lh: 18,
      ls: 0,
      caps: true,
      below14: true,
    },
  },
  {
    id: "copy-tiny",
    props: {
      ff: "var(--font-jetbrains-mono), monospace",
      fw: 300,
      size: 10,
      lh: 10,
      ls: 2,
      caps: true,
      tiny: true,
    },
  },
  {
    id: "button-body-lg",
    props: {
      ff: "var(--font-univers-cn), sans-serif",
      fw: 400,
      size: 24,
      lh: 24,
      ls: 0,
      caps: true,
      copy: true,
    },
  },
  {
    id: "button-body-caption",
    props: {
      ff: "var(--font-univers-cn), sans-serif",
      fw: 400,
      size: 10,
      lh: 10,
      ls: 0,
      caps: true,
      below14: true,
      lhFlag: true,
    },
  },
  {
    id: "footer-headline-primary",
    props: {
      ff: "var(--font-univers-bold-cn), sans-serif",
      fw: 700,
      size: 72,
      lh: 68,
      ls: -1,
      caps: true,
      deco: true,
    },
  },
  {
    id: "footer-decorative-primary",
    props: {
      ff: "var(--font-bootzy), sans-serif",
      fw: 400,
      size: 56,
      lh: 48,
      ls: 2,
      caps: true,
      deco: true,
    },
  },
  {
    id: "footer-decorative-secondary",
    props: {
      ff: "var(--font-bootzy), sans-serif",
      fw: 400,
      size: 24,
      lh: 32,
      ls: 2,
      caps: true,
      deco: true,
    },
  },
  {
    id: "team-card-primary",
    props: {
      ff: "var(--font-univers-bold-cn), sans-serif",
      fw: 700,
      size: 32,
      lh: 36,
      ls: -1,
      caps: true,
      deco: true,
    },
  },
];

function px(n) {
  const r = Math.round(n * 10000) / 10000;
  return Number.isInteger(r) ? String(r) : String(r);
}

function scalePx(n, kind) {
  const calc = `calc(${n} * 100vw / 1440)`;
  if (kind === "deco") {
    const floor = px(n * 0.4);
    return `max(${floor}px, ${calc})`;
  }
  if (kind === "copy") {
    return `max(14px, ${calc})`;
  }
  if (kind === "tiny") {
    return `max(10px, ${calc})`;
  }
  if (kind === "below14") {
    return { base: calc, below: `max(14px, ${calc})` };
  }
  return `max(${px(n * 0.4)}px, ${calc})`;
}

function scaleLs(n, kind) {
  if (n === 0) return "0";
  const calc = `calc(${n} * 100vw / 1440)`;
  if (n < 0) return calc;
  if (kind === "deco") return `max(${px(n * 0.4)}px, ${calc})`;
  return calc;
}

function block(token) {
  const { id, props } = token;
  const kind = props.tiny ? "tiny" : props.below14 ? "below14" : props.copy ? "copy" : props.deco ? "deco" : "deco";
  const lines = [
    `.${id} {`,
    `  margin: 0;`,
    `  font-family: ${props.ff};`,
    `  font-weight: ${props.fw};`,
  ];
  const fs = scalePx(props.size, kind);
  const lh = scalePx(props.lh, kind === "below14" ? "copy" : kind);
  if (typeof fs === "object") {
    lines.push(`  font-size: ${fs.base};`);
  } else {
    lines.push(`  font-size: ${fs};`);
  }
  lines.push(`  line-height: ${lh};`);
  lines.push(`  letter-spacing: ${scaleLs(props.ls, props.deco ? "deco" : "copy")};`);
  if (props.caps) lines.push(`  text-transform: uppercase;`);
  if (props.lhFlag) lines.push(`  /* FLAG: Figma line-height 0 — use 10px */`);
  lines.push(`}`);
  const out = [lines.join("\n")];
  if (typeof fs === "object") {
    out.push(`@media (max-width: 1439.98px) {`);
    out.push(`  .${id} { font-size: ${fs.below}; }`);
    out.push(`}`);
  }
  return out.join("\n");
}

const header = `/**
 * Figma typography tokens — scale: spec * (100vw / 1440), no max cap above 1440.
 * Served from /public/typography-tokens.css (pnpm sync:typography). Margins live in layout CSS only.
 */

`;

const css = header + TOKENS.map(block).join("\n\n") + "\n";

for (const rel of ["app/typography-tokens.css", "public/typography-tokens.css"]) {
  fs.writeFileSync(path.join(ROOT, rel), css);
}
console.log("Wrote typography tokens:", TOKENS.length, "classes");
