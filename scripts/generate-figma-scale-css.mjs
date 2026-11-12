#!/usr/bin/env node
/**
 * Emit scale helpers + spacing/radius CSS vars usage from figma-variables-source.json.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DESIGN_WIDTH, MOBILE_STACK_PX, scaleCalc, scalePx } from "./lib/figma-scale.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(ROOT, "scripts/data/figma-variables-source.json");
const OUT = path.join(ROOT, "app/figma-scale.css");

function main() {
  const data = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
  const light = data.light?.variables ?? {};

  const scaleLines = [];
  for (const [key, val] of Object.entries(light)) {
    if (!key.startsWith("Scale/")) continue;
    const n = Number.parseFloat(val);
    if (!Number.isFinite(n)) continue;
    const cssKey = key.toLowerCase().replace(/\//g, "-").replace(/\s/g, "-");
    scaleLines.push(`  --${cssKey}: ${scalePx(n, { capPx: n })};`);
  }

  const radiusLines = [];
  for (const [key, val] of Object.entries(light)) {
    if (!key.startsWith("Border Sizes/")) continue;
    const n = Number.parseFloat(val);
    const cssKey = key.toLowerCase().replace(/\//g, "-").replace(/,\s*/g, "").replace(/\s+/g, "-");
    if (Number.isFinite(n)) {
      radiusLines.push(`  --${cssKey}: ${scalePx(n, { capPx: n })};`);
    } else {
      radiusLines.push(`  --${cssKey}: ${val};`);
    }
  }

  const css = `/**
 * Figma layout scale (${DESIGN_WIDTH}px artboard).
 * px(N) = calc(N * min(100vw, ${DESIGN_WIDTH}px) / ${DESIGN_WIDTH})
 * Regenerate: pnpm sync:figma-scale
 */

:root {
  --figma-design-width: ${DESIGN_WIDTH}px;
  --figma-stack-bp: ${MOBILE_STACK_PX}px;
${scaleLines.join("\n")}
${radiusLines.join("\n")}
}

/**
 * Use in section CSS: padding: var(--figma-px, ${scaleCalc(24)});
 * Utility class for arbitrary Figma numbers via style="--n:72" is avoided;
 * prefer calc in component CSS with scaleCalc output duplicated at build time.
 */

@media (max-width: ${MOBILE_STACK_PX - 0.02}px) {
  .figma-stack {
    display: flex;
    flex-direction: column;
  }
}
`;

  fs.writeFileSync(OUT, css);
  fs.writeFileSync(path.join(ROOT, "public/figma-scale.css"), css);
  console.log("Wrote figma-scale.css");
}

main();
