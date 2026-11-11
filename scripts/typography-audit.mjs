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
      { selector: "#story .heading-secondary", token: "heading-secondary" },
      { selector: "#mission a.site-btn.button-body-lg", token: "button-body-lg" },
      { selector: ".mission-figma__copy", token: "copy-body" },
      { selector: ".footer-headline-primary", token: "footer-headline-primary" },
    ],
  },
  {
    path: "/en",
    probes: [
      { selector: "#silhouette .heading-primary-bold", token: "heading-primary-bold" },
      { selector: "#story .heading-secondary", token: "heading-secondary" },
      { selector: "#mission a.site-btn.button-body-lg", token: "button-body-lg" },
    ],
  },
  { path: "/kontakt", probes: [{ selector: ".contact-hero__title .heading-primary-bold", token: "heading-primary-bold" }] },
  {
    path: "/karriere",
    probes: [
      { selector: ".heading-secondary-bold", token: "heading-secondary-bold" },
      { selector: ".crew-job__meta.copy-tiny", token: "copy-tiny" },
    ],
  },
  {
    path: "/en/karriere",
    probes: [{ selector: ".crew-job__meta.copy-tiny", token: "copy-tiny" }],
  },
  {
    path: "/en/team",
    probes: [
      { selector: ".experts-figma__title.heading-secondary", token: "heading-secondary" },
      { selector: ".expert-card a.site-btn.button-body-caption", token: "button-body-caption" },
    ],
  },
  {
    path: "/team",
    probes: [
      { selector: ".experts-figma__title.heading-secondary", token: "heading-secondary" },
      { selector: ".expert-card a.site-btn.button-body-caption", token: "button-body-caption" },
    ],
  },
  { path: "/impressum", probes: [{ selector: ".heading-tertiary", token: "heading-tertiary" }] },
];

const BELOW14_SIZE_FLOOR = new Set(["button-body-caption", "copy-caption"]);

function expectedPx(specPx, viewport, tokenId = "", prop = "fontSize") {
  const raw = (specPx * viewport) / 1440;
  if (viewport < 1440 && BELOW14_SIZE_FLOOR.has(tokenId)) {
    return Math.max(14, raw);
  }
  if (viewport < 1440 && tokenId === "copy-tiny" && prop === "fontSize") {
    return Math.max(10, raw);
  }
  if (viewport < 1440 && tokenId === "copy-tiny" && prop === "lineHeight") {
    return Math.max(10, raw);
  }
  if (viewport < 1440 && ["copy-body", "copy-body-sm", "copy-body-lg", "button-body-lg"].includes(tokenId)) {
    return Math.max(14, raw);
  }
  return raw;
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

/** Step-scroll so IntersectionObserver + lazy chunks hydrate expert cards etc. */
async function stepScrollHydrate(page) {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    const step = Math.max(360, Math.floor(window.innerHeight * 0.75));
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y <= max; y += step) {
      window.scrollTo(0, Math.min(y, max));
      await delay(450);
    }
    window.scrollTo(0, max);
    await delay(800);
    window.scrollTo(0, 0);
    await delay(400);
  });
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
    "After load, audit step-scrolls the page so lazy sections hydrate. Expert EMAIL/PHONE: `.expert-card a.site-btn.button-body-caption`.",
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
          await stepScrollHydrate(page);
        } catch {
          lines.push(`| ${route.path} | ${viewport} | ${theme} | — | — | — | — | — | navigation error |`);
          await page.close();
          continue;
        }

        for (const probe of route.probes) {
          const spec = TOKEN_SPEC[probe.token];
          if (!spec) continue;
          await page.evaluate((sel) => {
            const target = document.querySelector(sel);
            if (target) {
              target.scrollIntoView({ block: "center", inline: "nearest" });
            } else {
              document
                .querySelector(".experts-figma__grid, #datasheet, #story")
                ?.scrollIntoView({ block: "center", inline: "nearest" });
            }
          }, probe.selector);
          try {
            await page.waitForSelector(probe.selector, { timeout: 15_000 });
          } catch {
            /* probe records missing */
          }
          await new Promise((r) => setTimeout(r, 500));
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

          const expFs = expectedPx(spec.fontSize, viewport, probe.token, "fontSize");
          const expLh = expectedPx(spec.lineHeight, viewport, probe.token, "lineHeight");
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

  lines.push("", "## Unmapped / remnants", "");
  lines.push("See `docs/typography-remnants.md` for fixed-px rules outside tokens (careers watermarks, expert initial `42cqi`, journey watermark vw, F1 headline 77.9px, WebGL labels, etc.).");
  lines.push("Remnants: HUD stat values (`80+`, `9`) still 16px Roman — see `docs/typography-remnants.md`.");

  await writeFile(OUT, `${lines.join("\n")}\n`);
  await browser.close();
  console.log(`Wrote ${OUT}`);
  console.log(`Screenshots: ${SHOT_DIR}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
