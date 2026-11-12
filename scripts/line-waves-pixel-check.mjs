#!/usr/bin/env node
/** Sample LineWaves canvas pixels at manifest (light + dark). G should exceed R. */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://127.0.0.1:3001";

async function sample(theme) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(BASE, { waitUntil: "networkidle" });
  if (theme === "light") {
    await page.evaluate(() => {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    });
  }
  await page.evaluate(() => {
    document.querySelectorAll("[data-rebuild-layer]").forEach((el) => {
      el.style.setProperty("visibility", "visible", "important");
    });
  });
  await page.evaluate(() => window.scrollTo(0, 1286));
  await page.mouse.click(960, 600);
  await page.waitForTimeout(6000);
  await page.waitForFunction(
    () => document.querySelector(".manifest-section__waves canvas"),
    { timeout: 60000 },
  );
  const rgb = await page.evaluate(() => {
    const c = document.querySelector(".manifest-section__waves canvas");
    if (!c) return null;
    const gl = c.getContext("webgl2") ?? c.getContext("webgl");
    if (!gl) return null;
    const x = Math.floor(c.width / 2);
    const y = Math.floor(c.height / 2);
    const p = new Uint8Array(4);
    gl.readPixels(x, c.height - y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, p);
    return { r: p[0], g: p[1], b: p[2], a: p[3] };
  });
  await browser.close();
  return rgb;
}

for (const theme of ["dark", "light"]) {
  const rgb = await sample(theme);
  const ok = rgb && rgb.g > rgb.r && rgb.g > 30;
  console.log(`${theme}:`, rgb, ok ? "PASS (green-dominant)" : "FAIL");
  if (!ok) process.exitCode = 1;
}
