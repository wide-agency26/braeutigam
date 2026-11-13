import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { GOLDEN_DIR } from "./figma-qa-shared.mjs";

function readFileSafe(p) {
  try {
    return fs.readFileSync(p);
  } catch {
    return null;
  }
}

/**
 * @param {import('playwright').Page} page
 * @param {{ icons?: Array<{ selector: string; figmaNodeId: string; golden: string; width?: number; height?: number }> }} assets
 * @param {string | undefined} sectionFilter
 */
export async function runIconsQa(page, assets, sectionFilter) {
  const rows = [];
  let failures = 0;
  const list = (assets.icons ?? []).filter(
    (i) => !sectionFilter || i.section === sectionFilter,
  );

  for (const t of list) {
    const el = page.locator(t.selector).first();
    if ((await el.count()) === 0) {
      rows.push({ label: t.figmaNodeId, status: "MISSING" });
      failures++;
      continue;
    }
    const goldenPath = path.join(GOLDEN_DIR, t.golden);
    const goldenBuf = readFileSafe(goldenPath);
    if (!goldenBuf) {
      rows.push({ label: t.figmaNodeId, status: "NO_GOLDEN", golden: goldenPath });
      failures++;
      continue;
    }

    if (t.golden.endsWith(".svg")) {
      const href = await el.evaluate((node) => {
        if (node instanceof HTMLImageElement) return node.src;
        return null;
      });
      if (!href) {
        rows.push({ label: t.figmaNodeId, status: "NO_SRC" });
        failures++;
        continue;
      }
      const res = await page.request.get(href.startsWith("http") ? href : new URL(href, page.url()).toString());
      const body = await res.body();
      const a = crypto.createHash("sha256").update(body).digest("hex");
      const b = crypto.createHash("sha256").update(goldenBuf).digest("hex");
      const ok = a === b;
      if (!ok) failures++;
      rows.push({ label: t.figmaNodeId, status: ok ? "PASS" : "FAIL", diffPct: ok ? 0 : 100 });
      continue;
    }

    const shot = await el.screenshot({ type: "png" });
    const imgA = PNG.sync.read(shot);
    const imgB = PNG.sync.read(goldenBuf);
    const w = Math.min(imgA.width, imgB.width);
    const h = Math.min(imgA.height, imgB.height);
    const diff = new PNG({ width: w, height: h });
    const mismatched = pixelmatch(imgA.data, imgB.data, diff.data, w, h, {
      threshold: 0.15,
      includeAA: true,
    });
    const pct = (mismatched / (w * h)) * 100;
    const ok = pct <= 5;
    if (!ok) failures++;
    rows.push({ label: t.figmaNodeId, status: ok ? "PASS" : "FAIL", diffPct: Math.round(pct * 10) / 10 });
  }
  return { rows, failures, kind: "icons" };
}

export function printIconRows(rows) {
  console.log("\n[icons] Asset fidelity (≤5% pixel diff)\n");
  for (const row of rows) {
    console.log(
      `${row.status} | ${row.label}` +
        (row.diffPct != null ? ` | diff ${row.diffPct}%` : "") +
        (row.golden ? ` | ${row.golden}` : ""),
    );
  }
}
