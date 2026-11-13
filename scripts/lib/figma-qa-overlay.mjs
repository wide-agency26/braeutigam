import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { GOLDEN_DIR, QA_OUTPUT } from "./figma-qa-shared.mjs";

/**
 * @param {import('playwright').Page} page
 * @param {{ sections?: Record<string, { scrollY?: number; overlaySelector?: string; golden?: string }> }} spec
 * @param {string | undefined} sectionFilter
 * @param {string} theme
 */
export async function runOverlayQa(page, spec, sectionFilter, theme) {
  const rows = [];
  let failures = 0;

  for (const [sectionName, section] of Object.entries(spec.sections ?? {})) {
    if (sectionFilter && sectionName !== sectionFilter) continue;
    if (!section.overlaySelector || !section.golden) continue;

    const scrollY = section.scrollY ?? 0;
    if (scrollY > 0) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(200);
    }

    const loc = page.locator(section.overlaySelector).first();
    if ((await loc.count()) === 0) {
      rows.push({ section: sectionName, status: "MISSING" });
      failures++;
      continue;
    }

    const goldenPath = path.join(GOLDEN_DIR, "overlays", section.golden);
    if (!fs.existsSync(goldenPath)) {
      rows.push({ section: sectionName, status: "NO_GOLDEN", golden: goldenPath });
      continue;
    }

    await page.evaluate(() => {
      for (const el of document.querySelectorAll("[data-rebuild-layer]")) {
        el.setAttribute("data-qa-masked", "1");
        el.style.visibility = "hidden";
      }
    });

    const shot = await loc.screenshot({ type: "png" });
    const golden = fs.readFileSync(goldenPath);
    const imgA = PNG.sync.read(shot);
    const imgB = PNG.sync.read(golden);
    const w = Math.min(imgA.width, imgB.width);
    const h = Math.min(imgA.height, imgB.height);
    const diff = new PNG({ width: w, height: h });
    const mismatched = pixelmatch(imgA.data, imgB.data, diff.data, w, h, {
      threshold: 0.12,
      includeAA: true,
    });
    const pct = (mismatched / (w * h)) * 100;
    const ok = pct <= 5;
    if (!ok) failures++;

    const outDir = path.join(QA_OUTPUT, sectionName, theme);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "preview.png"), shot);
    fs.writeFileSync(path.join(outDir, "diff.png"), PNG.sync.write(diff));

    rows.push({
      section: sectionName,
      status: ok ? "PASS" : "FAIL",
      diffPct: Math.round(pct * 10) / 10,
      preview: path.join(outDir, "preview.png"),
    });
  }
  return { rows, failures, kind: "overlay" };
}

export function printOverlayRows(rows) {
  console.log("\n[overlay] Section diff (rebuild layers masked, ≤5%)\n");
  for (const row of rows) {
    console.log(
      `${row.status} | ${row.section}` +
        (row.diffPct != null ? ` | ${row.diffPct}%` : "") +
        (row.preview ? ` | ${row.preview}` : "") +
        (row.golden ? ` | missing ${row.golden}` : ""),
    );
  }
}
