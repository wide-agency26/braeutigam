/** Read a resolved hex (or other) color from a CSS custom property on :root. */
export function readCssVarColor(varName: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return raw || fallback;
}
