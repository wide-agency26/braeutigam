#!/usr/bin/env node
/**
 * Figma QA orchestrator: geometry, content, colors, icons, overlay.
 *
 * Usage:
 *   node scripts/figma-qa.mjs [--base URL] [--section hero] [--theme dark|light] [--mode all|geometry|content|color|icon|overlay]
 */
import {
  ASSETS_PATH,
  COLORS_PATH,
  CONTENT_PATH,
  LAYOUT_PATH,
  openQaPage,
  parseQaArgs,
  readJson,
} from "./lib/figma-qa-shared.mjs";
import { runGeometryQa, printGeometryRows } from "./lib/figma-qa-geometry.mjs";
import { runContentQa, printContentRows } from "./lib/figma-qa-content.mjs";
import { runColorsQa, printColorRows } from "./lib/figma-qa-colors.mjs";
import { runIconsQa, printIconRows } from "./lib/figma-qa-icons.mjs";
import { runOverlayQa, printOverlayRows } from "./lib/figma-qa-overlay.mjs";

async function main() {
  const cli = parseQaArgs();
  const layout = readJson(LAYOUT_PATH);
  const content = readJson(CONTENT_PATH, { sections: {} });
  const colors = readJson(COLORS_PATH, { sections: {} });
  const assets = readJson(ASSETS_PATH, { icons: [] });
  const overlaySpec = readJson(LAYOUT_PATH);

  const baseUrl = cli.base ?? layout.baseUrl ?? "http://127.0.0.1:3001";
  const viewport = {
    width: layout.designWidth ?? 1920,
    height: layout.designHeight ?? 1080,
  };
  const modes =
    cli.mode === "all"
      ? ["geometry", "content", "colors", "icons", "overlay"]
      : cli.mode === "color"
        ? ["colors"]
        : [cli.mode ?? "geometry"];

  const themes = cli.theme ? [cli.theme] : ["light", "dark"];
  let totalFailures = 0;

  for (const theme of themes) {
    const { browser, page } = await openQaPage({ baseUrl, theme, viewport });
    console.log(`\n=== theme: ${theme} @ ${baseUrl} ===`);

    if (modes.includes("geometry")) {
      const { rows, failures } = await runGeometryQa(page, layout, cli.section);
      printGeometryRows(rows, viewport, layout.tolerancePx ?? 4);
      totalFailures += failures;
    }
    if (modes.includes("content")) {
      const { rows, failures } = await runContentQa(page, content, cli.section);
      printContentRows(rows);
      totalFailures += failures;
    }
    if (modes.includes("colors")) {
      const { rows, failures } = await runColorsQa(page, colors, cli.section);
      printColorRows(rows);
      totalFailures += failures;
    }
    if (modes.includes("icons")) {
      const { rows, failures } = await runIconsQa(page, assets, cli.section);
      printIconRows(rows);
      totalFailures += failures;
    }
    if (modes.includes("overlay")) {
      const { rows, failures } = await runOverlayQa(
        page,
        overlaySpec,
        cli.section,
        theme,
      );
      printOverlayRows(rows);
      totalFailures += failures;
    }

    await browser.close();
  }

  console.log(`\n${totalFailures} issue(s) total\n`);
  process.exit(totalFailures > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
