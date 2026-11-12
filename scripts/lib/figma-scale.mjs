/**
 * Figma 1920 artboard scale helpers (shared by generators).
 * CSS output: calc(N * min(100vw, 1920px) / 1920)
 */

export const DESIGN_WIDTH = 1920;
export const MOBILE_STACK_PX = 768;

/** @param {number} n design px at 1920 */
export function scaleCalc(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return "0";
  const r = Math.round(v * 10000) / 10000;
  const num = Number.isInteger(r) ? String(r) : String(r);
  return `calc(${num} * min(100vw, ${DESIGN_WIDTH}px) / ${DESIGN_WIDTH})`;
}

/**
 * @param {number} n
 * @param {{ floorPx?: number; capPx?: number }} [opts]
 */
export function scalePx(n, opts = {}) {
  const base = scaleCalc(n);
  const { floorPx, capPx } = opts;
  if (floorPx != null && capPx != null) {
    return `min(${capPx}px, max(${floorPx}px, ${base}))`;
  }
  if (floorPx != null) return `max(${floorPx}px, ${base})`;
  if (capPx != null) return `min(${capPx}px, ${base})`;
  return base;
}

/**
 * Line height from Figma: px (scale) or percent/ratio (unitless).
 * @param {number} fontSize design px
 * @param {{ kind: "px", value: number } | { kind: "ratio", value: number }} lh
 */
export function scaleLineHeight(fontSize, lh) {
  if (lh.kind === "ratio") return String(lh.value);
  return scalePx(lh.value);
}

/**
 * Letter-spacing: Figma px (scaled) or percent of font size → em.
 * @param {{ kind: "px", value: number } | { kind: "percent", value: number }} ls
 */
export function scaleLetterSpacing(ls) {
  if (ls.kind === "px") {
    if (ls.value === 0) return "0";
    return scaleCalc(ls.value);
  }
  const em = ls.value / 100;
  return `${em}em`;
}
