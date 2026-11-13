import { fmt } from "./figma-qa-shared.mjs";

/**
 * @param {import('playwright').Page} page
 * @param {{ sections: Record<string, object>; tolerancePx?: number }} spec
 * @param {string | undefined} sectionFilter
 */
export async function runGeometryQa(page, spec, sectionFilter) {
  const tolerance = spec.tolerancePx ?? 4;
  const sections = Object.entries(spec.sections ?? {}).filter(
    ([name]) => !sectionFilter || name === sectionFilter,
  );
  const rows = [];
  let failures = 0;

  for (const [sectionName, section] of sections) {
    const scrollY = section.scrollY ?? 0;
    if (scrollY > 0) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(150);
    }

    let anchor = { x: 0, y: 0 };
    if (section.anchor) {
      const anchorBox = await page.locator(section.anchor).first().boundingBox();
      if (anchorBox) anchor = { x: anchorBox.x, y: anchorBox.y };
    }

    for (const t of section.targets ?? []) {
      const el = page.locator(t.selector).first();
      if ((await el.count()) === 0) {
        rows.push({ section: sectionName, label: t.label, status: "MISSING" });
        failures++;
        continue;
      }
      const box = await el.boundingBox();
      if (!box) {
        rows.push({ section: sectionName, label: t.label, status: "NO_BOX" });
        failures++;
        continue;
      }
      const exp = t.figma;
      const dx = box.x - (anchor.x + exp.x);
      const dy = box.y - (anchor.y + exp.y);
      const dw = box.width - exp.w;
      const dh = box.height - exp.h;
      const ok =
        Math.abs(dx) <= tolerance &&
        Math.abs(dy) <= tolerance &&
        Math.abs(dw) <= tolerance &&
        Math.abs(dh) <= tolerance;
      if (!ok) failures++;
      rows.push({
        section: sectionName,
        label: t.label,
        figmaId: t.figmaNodeId ?? "—",
        status: ok ? "PASS" : "FAIL",
        x: { figma: exp.x, dom: fmt(box.x), Δ: fmt(dx) },
        y: { figma: exp.y, dom: fmt(box.y), Δ: fmt(dy) },
        w: { figma: exp.w, dom: fmt(box.width), Δ: fmt(dw) },
        h: { figma: exp.h, dom: fmt(box.height), Δ: fmt(dh) },
      });
    }
  }
  return { rows, failures, kind: "geometry" };
}

export function printGeometryRows(rows, viewport, tolerance) {
  console.log(`\n[geometry] Figma QA @ ${viewport.width}×${viewport.height} (±${tolerance}px)\n`);
  for (const row of rows) {
    if (row.status === "MISSING" || row.status === "NO_BOX") {
      console.log(`${row.section} | ${row.label} | ${row.status}`);
      continue;
    }
    console.log(
      `${row.status} | ${row.label} | figma ${row.figmaId} | ` +
        `x Δ${row.x.Δ} y Δ${row.y.Δ} w Δ${row.w.Δ} h Δ${row.h.Δ}`,
    );
  }
}
