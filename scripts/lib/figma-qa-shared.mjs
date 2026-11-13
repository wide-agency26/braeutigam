import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const LAYOUT_PATH = path.join(ROOT, "scripts/data/figma-qa-layout.json");
export const CONTENT_PATH = path.join(ROOT, "scripts/data/figma-qa-content.json");
export const COLORS_PATH = path.join(ROOT, "scripts/data/figma-qa-colors.json");
export const ASSETS_PATH = path.join(ROOT, "scripts/data/figma-qa-assets.json");
export const GOLDEN_DIR = path.join(ROOT, "public/figma-qa/golden");
export const QA_OUTPUT = path.join(ROOT, "qa-output");

/** @param {string[]} argv */
export function parseQaArgs(argv = process.argv.slice(2)) {
  /** @type {{ base?: string; section?: string; theme?: string; mode?: string }} */
  const out = { mode: "all" };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--base" && argv[i + 1]) out.base = argv[++i];
    else if (argv[i] === "--section" && argv[i + 1]) out.section = argv[++i];
    else if (argv[i] === "--theme" && argv[i + 1]) out.theme = argv[++i];
    else if (argv[i] === "--mode" && argv[i + 1]) out.mode = argv[++i];
  }
  return out;
}

export function readJson(filePath, fallback = {}) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

/** @returns {Record<string, string>} */
export function protectionHeaders() {
  /** @type {Record<string, string>} */
  const extraHTTPHeaders = {};
  if (process.env.VERCEL_OIDC_TOKEN) {
    extraHTTPHeaders["x-vercel-trusted-oidc-idp-token"] =
      process.env.VERCEL_OIDC_TOKEN;
  }
  if (process.env.VERCEL_PROTECTION_BYPASS) {
    extraHTTPHeaders["x-vercel-protection-bypass"] =
      process.env.VERCEL_PROTECTION_BYPASS;
  }
  return extraHTTPHeaders;
}

/**
 * @param {{ baseUrl: string; theme?: string; viewport: { width: number; height: number } }} opts
 */
export async function openQaPage(opts) {
  const browser = await chromium.launch({ headless: true });
  const headers = protectionHeaders();
  const context = await browser.newContext(
    Object.keys(headers).length ? { extraHTTPHeaders: headers } : {},
  );
  const page = await context.newPage();
  await page.setViewportSize(opts.viewport);
  await page.goto(opts.baseUrl, { waitUntil: "networkidle" });
  if (opts.theme === "dark") {
    await page.evaluate(() => document.documentElement.classList.add("dark"));
  } else if (opts.theme === "light") {
    await page.evaluate(() => document.documentElement.classList.remove("dark"));
  }
  return { browser, page };
}

export function fmt(n) {
  return typeof n === "number" ? Math.round(n * 10) / 10 : "—";
}
