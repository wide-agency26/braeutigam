/** Parse a CSS color string to linear RGB 0–1 for WebGL uniforms. */
export function parseColorToVec3(input: string): [number, number, number] {
  const raw = input.trim();
  if (!raw) return [0, 0, 0];

  if (raw.startsWith("#")) {
    let h = raw.slice(1);
    if (h.length === 3) {
      h = h
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (h.length >= 6) {
      return [
        parseInt(h.slice(0, 2), 16) / 255,
        parseInt(h.slice(2, 4), 16) / 255,
        parseInt(h.slice(4, 6), 16) / 255,
      ];
    }
  }

  const rgbMatch = raw.match(
    /^rgba?\(\s*([\d.]+)(?:%)?\s*,\s*([\d.]+)(?:%)?\s*,\s*([\d.]+)(?:%)?/i,
  );
  if (rgbMatch) {
    const isPercent = raw.includes("%");
    const toUnit = (v: string) => {
      const n = parseFloat(v);
      return isPercent ? n / 100 : n / 255;
    };
    return [
      Math.min(1, Math.max(0, toUnit(rgbMatch[1]))),
      Math.min(1, Math.max(0, toUnit(rgbMatch[2]))),
      Math.min(1, Math.max(0, toUnit(rgbMatch[3]))),
    ];
  }

  return [0, 0, 0];
}
