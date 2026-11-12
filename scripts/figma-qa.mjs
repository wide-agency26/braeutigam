#!/usr/bin/env node
/**
 * Compare rendered section geometry to Figma absolute bounds at 1920×1080.
 *
 * Usage:
 *   node scripts/figma-qa.mjs [--base URL] [--section hero] [--theme dark|light]
 *
 * Requires: dev server running, scripts/data/figma-qa-layout.json populated per section.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LAYOUT = path.join(ROOT, "scripts/data/figma-qa-layout.json");

function parseArgs() {
  const args = process.argv.slice(2);
  /** @type {{ base?: string; section?: string; theme?: string }} */
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--base" && args[i + 1]) out.base = args[++i];
    else if (args[i] === "--section" && args[i + 1]) out.section = args[++i];
    else if (args[i] === "--theme" && args[i + 1]) out.theme = args[++i];
  }
  return out;
}

function fmt(n) {
  return typeof n === "number" ? Math.round(n * 10) / 10 : "—";
}

async function main() {
  const cli = parseArgs();
  const spec = JSON.parse(fs.readFileSync(LAYOUT, "utf8"));
  const baseUrl = cli.base ?? spec.baseUrl ?? "http://127.0.0.1:3000";
  const tolerance = spec.tolerancePx ?? 4;
  const viewport = {
    width: spec.designWidth ?? 1920,
    height: spec.designHeight ?? 1080,
  };

  const sectionFilter = cli.section;
  const sections = Object.entries(spec.sections ?? {}).filter(
    ([name]) => !sectionFilter || name === sectionFilter,
  );

  if (sections.length === 0) {
    console.log(
      "No sections in figma-qa-layout.json" +
        (sectionFilter ? ` for --section ${sectionFilter}` : "") +
        ". Add bounds from Figma MCP before QA.",
    );
    process.exit(0);
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize(viewport);

  if (cli.theme === "dark") {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
    });
  } else if (cli.theme === "light") {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      document.documentElement.classList.remove("dark");
    });
  } else {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
  }

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

    const targets = section.targets ?? [];
    for (const t of targets) {
      const el = page.locator(t.selector).first();
      const count = await el.count();
      if (count === 0) {
        rows.push({
          section: sectionName,
          label: t.label,
          status: "MISSING",
          selector: t.selector,
        });
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

  await browser.close();

  console.log(`\nFigma QA @ ${viewport.width}×${viewport.height} (±${tolerance}px)\n`);
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
  console.log(`\n${failures} issue(s)\n`);
  process.exit(failures > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
