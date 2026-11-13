#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  LAYOUT_PATH,
  QA_OUTPUT,
  openQaPage,
  parseQaArgs,
  readJson,
  ROOT,
} from "./lib/figma-qa-shared.mjs";

async function main() {
  const cli = parseQaArgs();
  const layout = readJson(LAYOUT_PATH);
  const baseUrl = cli.base ?? layout.baseUrl ?? "http://127.0.0.1:3001";
  const viewport = {
    width: layout.designWidth ?? 1920,
    height: layout.designHeight ?? 1080,
  };
  const themes = cli.theme ? [cli.theme] : ["light", "dark"];
  const { browser, page } = await openQaPage({
    baseUrl,
    theme: themes[0],
    viewport,
  });

  for (const theme of themes) {
    await page.evaluate((t) => {
      document.documentElement.classList.toggle("dark", t === "dark");
    }, theme);

    for (const [sectionName, section] of Object.entries(layout.sections ?? {})) {
      if (cli.section && cli.section !== sectionName) continue;
      if (!section.overlaySelector) continue;
      const scrollY = section.scrollY ?? 0;
      if (scrollY > 0) {
        await page.evaluate((y) => window.scrollTo(0, y), scrollY);
        await page.waitForTimeout(200);
      }
      const loc = page.locator(section.overlaySelector).first();
      if ((await loc.count()) === 0) continue;
      const outDir = path.join(QA_OUTPUT, sectionName, theme);
      fs.mkdirSync(outDir, { recursive: true });
      const preview = path.join(outDir, "preview.png");
      await loc.screenshot({ path: preview, type: "png" });
      const golden = path.join(
        ROOT,
        "public/figma-qa/golden/overlays",
        section.golden ?? `${sectionName}-${theme}.png`,
      );
      const pairPath = path.join(outDir, "pair-preview.png");
      fs.copyFileSync(preview, pairPath);
      if (fs.existsSync(golden)) {
        fs.copyFileSync(golden, path.join(outDir, "figma.png"));
      }
      console.log(`visual-pair | ${sectionName} | ${theme} | ${pairPath}`);
    }
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
