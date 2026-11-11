#!/usr/bin/env node
/**
 * Read-only typography audit against local dev (default http://127.0.0.1:3000).
 * Usage: node scripts/typography-audit.mjs [--base URL] [--out docs/typography-audit.md]
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const baseIdx = args.indexOf("--base");
const outIdx = args.indexOf("--out");
const BASE = baseIdx >= 0 ? args[baseIdx + 1] : "http://127.0.0.1:3000";
const OUT =
  outIdx >= 0
    ? path.resolve(args[outIdx + 1])
    : path.join(ROOT, "docs", "typography-audit.md");

const ROUTES = [
  { path: "/", locale: "de" },
  { path: "/en", locale: "en" },
  { path: "/karriere", locale: "de" },
  { path: "/en/karriere", locale: "en" },
  { path: "/kontakt", locale: "de" },
  { path: "/en/kontakt", locale: "en" },
  { path: "/craft", locale: "de" },
  { path: "/en/craft", locale: "en" },
  { path: "/en/team", locale: "en" },
  { path: "/impressum", locale: "de" },
  { path: "/datenschutz", locale: "de" },
  { path: "/en/imprint", locale: "en" },
  { path: "/en/privacy", locale: "en" },
];

const SELECTORS = [
  { selector: ".heading-primary-bold", token: "heading-primary-bold", expect: { fontSize: "100px", lineHeight: "100px" } },
  { selector: ".heading-secondary", token: "heading-secondary", expect: { fontSize: "76px", lineHeight: "52px" } },
  { selector: ".heading-tertiary", token: "heading-tertiary", expect: { fontSize: "57px", lineHeight: "57px" } },
  { selector: ".copy-body", token: "copy-body", expect: { fontSize: "20px", lineHeight: "24px" } },
  { selector: ".copy-tiny", token: "copy-tiny", expect: { fontSize: "10px", lineHeight: "10px" } },
  { selector: ".footer-headline-primary", token: "footer-headline-primary", expect: { fontSize: "72px", lineHeight: "68px" } },
  { selector: ".team-card-primary", token: "team-card-primary", expect: { fontSize: "32px", lineHeight: "36px" } },
];

async function loadPuppeteer() {
  try {
    return await import("puppeteer");
  } catch {
    console.error(
      "puppeteer is not installed. Run: pnpm add -D puppeteer\nFalling back to fetch-only (no computed styles).",
    );
    return null;
  }
}

async function samplePage(puppeteer, url, theme) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  if (theme === "light") {
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem("braeutigam-theme", "light");
    });
  }
  await page.goto(url, { waitUntil: "networkidle2", timeout: 120_000 });

  const rows = await page.evaluate((sels) => {
    return sels.flatMap(({ selector, token }) => {
      const el = document.querySelector(selector);
      if (!el) return [{ token, selector, status: "missing" }];
      const cs = getComputedStyle(el);
      return [
        {
          token,
          selector,
          status: "found",
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          lineHeight: cs.lineHeight,
          letterSpacing: cs.letterSpacing,
          fontWeight: cs.fontWeight,
        },
      ];
    });
  }, SELECTORS);

  const shotDir = path.join(ROOT, "docs", "typography-screenshots");
  await mkdir(shotDir, { recursive: true });
  const slug = url.replace(BASE, "").replace(/\//g, "_") || "home";
  await page.screenshot({
    path: path.join(shotDir, `${slug}_${theme}_1440.png`),
    fullPage: false,
  });
  await page.setViewport({ width: 390, height: 844 });
  await page.screenshot({
    path: path.join(shotDir, `${slug}_${theme}_390.png`),
    fullPage: false,
  });

  await browser.close();
  return rows;
}

function matchRow(row, expect) {
  if (row.status !== "found" || !expect) return row.status === "missing" ? "missing" : "n/a";
  const ok =
    row.fontSize === expect.fontSize &&
    (expect.lineHeight ? row.lineHeight === expect.lineHeight : true);
  return ok ? "yes" : "no";
}

async function main() {
  const puppeteerMod = await loadPuppeteer();
  const allRows = [];
  const lines = [
    "# Typography audit (1440px)",
    "",
    `Base URL: ${BASE}`,
    `Generated: ${new Date().toISOString()}`,
    "",
    "| Route | Token | Selector | font-size | line-height | match |",
    "|-------|-------|----------|-----------|-------------|-------|",
  ];

  if (!puppeteerMod) {
    for (const route of ROUTES) {
      const res = await fetch(`${BASE}${route.path}`);
      lines.push(`| ${route.path} | — | — | — | — | fetch ${res.status} |`);
    }
    await mkdir(path.dirname(OUT), { recursive: true });
    await writeFile(OUT, lines.join("\n") + "\n");
    console.log(`Wrote ${OUT} (no Puppeteer)`);
    return;
  }

  const puppeteer = puppeteerMod.default;

  for (const route of ROUTES) {
    const url = `${BASE}${route.path}`;
    let rows;
    try {
      rows = await samplePage(puppeteer, url, "dark");
    } catch (err) {
      lines.push(`| ${route.path} | — | — | — | — | error: ${err.message} |`);
      continue;
    }
    for (const row of rows) {
      const spec = SELECTORS.find((s) => s.token === row.token);
      const match = matchRow(row, spec?.expect);
      lines.push(
        `| ${route.path} | ${row.token} | ${row.selector} | ${row.fontSize ?? "—"} | ${row.lineHeight ?? "—"} | ${match} |`,
      );
      allRows.push({ route: route.path, ...row, match });
    }
  }

  const unmapped = allRows.filter((r) => r.status === "missing");
  if (unmapped.length) {
    lines.push("", "## Missing selectors", "");
    for (const u of unmapped) {
      lines.push(`- ${u.route}: \`${u.selector}\``);
    }
  }

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, lines.join("\n") + "\n");
  console.log(`Wrote ${OUT}`);
  console.log(`Screenshots: docs/typography-screenshots/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
