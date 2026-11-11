#!/usr/bin/env node
/**
 * Typography audit — 390 / 1440 / 1920, DE+EN, light+dark.
 * Usage: node scripts/typography-audit.mjs [--base http://127.0.0.1:3000]
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const baseIdx = args.indexOf("--base");
const BASE = baseIdx >= 0 ? args[baseIdx + 1] : "http://127.0.0.1:3000";
const OUT = path.join(ROOT, "docs", "typography-audit.md");
const SHOT_DIR = path.join(ROOT, "docs", "typography-screenshots");

const VIEWPORTS = [390, 1440, 1920];
const THEMES = ["dark", "light"];

/** Figma desktop spec @ 1440 */
const TOKEN_SPEC = {
  "heading-primary-bold": { fontSize: 100, lineHeight: 100, letterSpacing: 0 },
  "heading-secondary": { fontSize: 76, lineHeight: 52, letterSpacing: -2 },
  "heading-secondary-bold": { fontSize: 76, lineHeight: 76, letterSpacing: -2 },
  "heading-tertiary": { fontSize: 57, lineHeight: 57, letterSpacing: 0 },
  "decorative-primary": { fontSize: 332, lineHeight: 232, letterSpacing: 8 },
  "decorative-secondary": { fontSize: 72, lineHeight: 84, letterSpacing: 4 },
  "decorative-tertiary": { fontSize: 42, lineHeight: 48, letterSpacing: 2 },
  "copy-body-lg": { fontSize: 28, lineHeight: 38, letterSpacing: 0 },
  "copy-body": { fontSize: 20, lineHeight: 24, letterSpacing: 0 },
  "copy-body-sm": { fontSize: 14, lineHeight: 18, letterSpacing: 0 },
  "copy-caption": { fontSize: 12, lineHeight: 18, letterSpacing: 0 },
  "copy-tiny": { fontSize: 10, lineHeight: 10, letterSpacing: 2 },
  "button-body-lg": { fontSize: 24, lineHeight: 24, letterSpacing: 0 },
  "button-body-caption": { fontSize: 10, lineHeight: 10, letterSpacing: 0 },
  "footer-headline-primary": { fontSize: 72, lineHeight: 68, letterSpacing: -1 },
  "footer-decorative-primary": { fontSize: 56, lineHeight: 48, letterSpacing: 2 },
  "footer-decorative-secondary": { fontSize: 24, lineHeight: 32, letterSpacing: 2 },
  "team-card-primary": { fontSize: 32, lineHeight: 36, letterSpacing: -1 },
};

const ROUTE_PROBES = [
  {
    path: "/",
    probes: [
      { selector: "#silhouette .heading-primary-bold", token: "heading-primary-bold" },
      { selector: "#silhouette .heading-secondary", token: "heading-secondary" },
      { selector: "#silhouette .decorative-tertiary", token: "decorative-tertiary" },
      { selector: "#silhouette .copy-tiny", token: "copy-tiny" },
      { selector: ".mission-figma__copy", token: "copy-body" },
      { selector: ".footer-headline-primary", token: "footer-headline-primary" },
    ],
  },
  { path: "/en", probes: [{ selector: "#silhouette .heading-primary-bold", token: "heading-primary-bold" }] },
  { path: "/kontakt", probes: [{ selector: ".contact-hero__title .heading-primary-bold", token: "heading-primary-bold" }] },
  { path: "/karriere", probes: [{ selector: ".heading-secondary-bold", token: "heading-secondary-bold" }] },
  { path: "/en/team", probes: [{ selector: ".heading-secondary", token: "heading-secondary" }] },
  { path: "/impressum", probes: [{ selector: ".heading-tertiary", token: "heading-tertiary" }] },
];

function expectedPx(specPx, viewport) {
  return (specPx * viewport) / 1440;
}

function parsePx(str) {
  if (!str || str === "normal") return null;
  const n = Number.parseFloat(str);
  return Number.isFinite(n) ? n : null;
}

function closeEnough(actual, expected, viewport) {
  if (actual == null || expected == null) return false;
  const tol = viewport === 1440 ? 1.1 : viewport === 1920 ? 1.5 : 2;
  return Math.abs(actual - expected) <= tol;
}

async function loadPuppeteer() {
  return import("puppeteer");
}

async function run() {
  const puppeteer = (await loadPuppeteer()).default;
  const browser = await puppeteer.launch({ headless: true });
  const lines = [
    "# Typography audit",
    "",
    `Base: ${BASE}`,
    `Generated: ${new Date().toISOString()}`,
    "",
    "Scale: at viewport W, expected px = spec × (W / 1440). No cap above 1440.",
    "",
    "| Route | VP | Theme | Token | font-size | expected | lh | expected lh | match |",
    "|-------|-----|-------|-------|-----------|----------|-----|-------------|-------|",
  ];

  await mkdir(SHOT_DIR, { recursive: true });

  for (const route of ROUTE_PROBES) {
    for (const viewport of VIEWPORTS) {
      for (const theme of THEMES) {
        const page = await browser.newPage();
        await page.setViewport({ width: viewport, height: 900, deviceScaleFactor: 1 });
        if (theme === "light") {
          await page.evaluateOnNewDocument(() => {
            localStorage.setItem("braeutigam-theme", "light");
          });
        } else {
          await page.evaluateOnNewDocument(() => {
            localStorage.removeItem("braeutigam-theme");
          });
        }
        const url = `${BASE}${route.path}`;
        try {
          await page.goto(url, { waitUntil: "networkidle2", timeout: 120_000 });
        } catch {
          lines.push(`| ${route.path} | ${viewport} | ${theme} | — | — | — | — | — | navigation error |`);
          await page.close();
          continue;
        }

        for (const probe of route.probes) {
          const spec = TOKEN_SPEC[probe.token];
          if (!spec) continue;
          const row = await page.evaluate((sel) => {
            const el = document.querySelector(sel);
            if (!el) return null;
            const cs = getComputedStyle(el);
            return { fontSize: cs.fontSize, lineHeight: cs.lineHeight };
          }, probe.selector);

          if (!row) {
            lines.push(`| ${route.path} | ${viewport} | ${theme} | ${probe.token} | — | — | — | — | missing |`);
            continue;
          }

          const expFs = expectedPx(spec.fontSize, viewport);
          const expLh = expectedPx(spec.lineHeight, viewport);
          const actFs = parsePx(row.fontSize);
          const actLh = parsePx(row.lineHeight);
          const match =
            closeEnough(actFs, expFs, viewport) && closeEnough(actLh, expLh, viewport) ? "yes" : "no";

          lines.push(
            `| ${route.path} | ${viewport} | ${theme} | ${probe.token} | ${row.fontSize} | ${expFs.toFixed(2)}px | ${row.lineHeight} | ${expLh.toFixed(2)}px | ${match} |`,
          );
        }

        if (route.path === "/" && viewport >= 1440 && theme === "dark") {
          const slug = viewport === 1440 ? "home_hero_1440_preview" : "home_hero_1920_preview";
          await page.screenshot({
            path: path.join(SHOT_DIR, `${slug}.png`),
            clip: { x: 0, y: 0, width: viewport, height: 800 },
          });
        }

        await page.close();
      }
    }
  }

  const PROD =
    process.env.TYPOGRAPHY_PROD_URL || "https://www.braeutigam-gmbh.eu";
  for (const viewport of [1440, 1920]) {
    const page = await browser.newPage();
    await page.setViewport({ width: viewport, height: 900 });
    try {
      await page.goto(PROD, { waitUntil: "networkidle2", timeout: 90_000 });
      await page.screenshot({
        path: path.join(SHOT_DIR, `home_hero_${viewport}_production.png`),
        clip: { x: 0, y: 0, width: viewport, height: 800 },
      });
    } catch (e) {
      lines.push("", `Production hero screenshot @ ${viewport}px failed: ${e.message}`, "");
    }
    await page.close();
  }

  lines.push("", "## Unmapped (no Figma token applied)", "");
  lines.push("- `.career-watermark` — outlined display stroke (careers)");
  lines.push("- Home datasheet HUD chrome (`HomePage` top badges) — no named token");
  lines.push("- Horizontal timeline scrolly chrome (`text-sm` year labels)");
  lines.push("- Circular gallery canvas label font (WebGL string)");
  lines.push("- Mission absolute frame: legacy proportional layout vs 1440 vw tokens");

  await writeFile(OUT, `${lines.join("\n")}\n`);
  await browser.close();
  console.log(`Wrote ${OUT}`);
  console.log(`Screenshots: ${SHOT_DIR}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
