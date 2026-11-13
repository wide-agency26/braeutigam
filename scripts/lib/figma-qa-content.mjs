/**
 * @param {import('playwright').Page} page
 * @param {{ sections?: Record<string, { scrollY?: number; content?: Array<{ selector: string; figmaNodeId?: string; text: string; exact?: boolean }> }> }} spec
 * @param {string | undefined} sectionFilter
 */
export async function runContentQa(page, spec, sectionFilter) {
  const rows = [];
  let failures = 0;

  for (const [sectionName, section] of Object.entries(spec.sections ?? {})) {
    if (sectionFilter && sectionName !== sectionFilter) continue;
    const scrollY = section.scrollY ?? 0;
    if (scrollY > 0) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(150);
    }
    for (const t of section.content ?? []) {
      const el = page.locator(t.selector).first();
      if ((await el.count()) === 0) {
        rows.push({ section: sectionName, label: t.figmaNodeId ?? t.selector, status: "MISSING" });
        failures++;
        continue;
      }
      const text = (await el.innerText()).replace(/\s+/g, " ").trim();
      const expected = t.text.replace(/\s+/g, " ").trim();
      const ok = t.exact !== false ? text === expected : text.toLowerCase() === expected.toLowerCase();
      if (!ok) failures++;
      rows.push({
        section: sectionName,
        label: t.figmaNodeId ?? t.selector,
        status: ok ? "PASS" : "FAIL",
        expected,
        actual: text,
      });
    }
  }
  return { rows, failures, kind: "content" };
}

export function printContentRows(rows) {
  console.log("\n[content] Text fidelity\n");
  for (const row of rows) {
    if (row.status === "MISSING") {
      console.log(`MISSING | ${row.section} | ${row.label}`);
      continue;
    }
    console.log(
      `${row.status} | ${row.section} | ${row.label}` +
        (row.status === "FAIL" ? ` | expected "${row.expected}" got "${row.actual}"` : ""),
    );
  }
}
