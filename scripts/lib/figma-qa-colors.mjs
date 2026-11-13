/**
 * @param {import('playwright').Page} page
 * @param {{ sections?: Record<string, { scrollY?: number; colors?: Array<{ selector: string; figmaNodeId?: string; property?: string; expected: string }> }> }} spec
 * @param {string | undefined} sectionFilter
 */
export async function runColorsQa(page, spec, sectionFilter) {
  const rows = [];
  let failures = 0;

  for (const [sectionName, section] of Object.entries(spec.sections ?? {})) {
    if (sectionFilter && !sectionName.startsWith(sectionFilter)) continue;
    const scrollY = section.scrollY ?? 0;
    if (scrollY > 0) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(150);
    }
    for (const t of section.colors ?? []) {
      const el = page.locator(t.selector).first();
      if ((await el.count()) === 0) {
        rows.push({ section: sectionName, label: t.figmaNodeId ?? t.selector, status: "MISSING" });
        failures++;
        continue;
      }
      const prop = t.property ?? "color";
      const actual = await el.evaluate((node, p) => getComputedStyle(node)[p], prop);
      const ok = normalizeColor(actual) === normalizeColor(t.expected);
      if (!ok) failures++;
      rows.push({
        section: sectionName,
        label: t.figmaNodeId ?? t.selector,
        status: ok ? "PASS" : "FAIL",
        expected: t.expected,
        actual,
      });
    }
  }
  return { rows, failures, kind: "colors" };
}

function normalizeColor(c) {
  return (c ?? "").replace(/\s+/g, "").toLowerCase();
}

export function printColorRows(rows) {
  console.log("\n[colors] Token / fill fidelity\n");
  for (const row of rows) {
    if (row.status === "MISSING") {
      console.log(`MISSING | ${row.section} | ${row.label}`);
      continue;
    }
    console.log(
      `${row.status} | ${row.section} | ${row.label}` +
        (row.status === "FAIL" ? ` | expected ${row.expected} got ${row.actual}` : ""),
    );
  }
}
