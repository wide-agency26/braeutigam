#!/usr/bin/env node
/**
 * Light + dark screenshots for PR — 390 / 1440 / 1920, DE + EN routes.
 * Usage: pnpm dev & node scripts/light-mode-screenshots.mjs
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "http://127.0.0.1:3000";
const OUT = path.join(ROOT, "docs", "light-mode-screenshots");
const VIEWPORTS = [390, 1440, 1920];
const ROUTES = [
  "/",
  "/en",
  "/team",
  "/en/team",
  "/karriere",
  "/en/karriere",
  "/karriere/senior-carbon-fiber-laminator",
  "/kontakt",
  "/en/kontakt",
  "/impressum",
  "/en/imprint",
  "/datenschutz",
  "/en/privacy",
];

async function stepScroll(page) {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    const step = Math.max(320, window.innerHeight * 0.65);
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y <= max; y += step) {
      window.scrollTo(0, Math.min(y, max));
      await delay(350);
    }
    window.scrollTo(0, 0);
    await delay(300);
  });
}

async function run() {
  const puppeteer = (await import("puppeteer")).default;
  await mkdir(OUT, { recursive: true });
  const browser = await puppeteer.launch({ headless: true });

  for (const theme of ["light", "dark"]) {
    for (const route of ROUTES) {
      for (const viewport of VIEWPORTS) {
        const page = await browser.newPage();
        await page.setViewport({ width: viewport, height: 900, deviceScaleFactor: 1 });
        if (theme === "light") {
          await page.evaluateOnNewDocument(() => localStorage.setItem("braeutigam-theme", "light"));
        } else {
          await page.evaluateOnNewDocument(() => {
            localStorage.setItem("braeutigam-theme", "dark");
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
          });
        }
        const slug = `${route.replace(/\//g, "_").replace(/^_/, "") || "home"}_${viewport}_${theme}`;
        try {
          await page.goto(`${BASE}${route}`, { waitUntil: "networkidle2", timeout: 120_000 });
          await stepScroll(page);
          await page.screenshot({
            path: path.join(OUT, `${slug}.png`),
            fullPage: viewport === 390,
          });
        } catch (e) {
          console.warn(slug, e.message);
        }
        await page.close();
      }
    }
  }

  await browser.close();
  console.log("Screenshots:", OUT);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
