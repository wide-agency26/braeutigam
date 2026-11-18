import { bindings, defineConfig, defineWorker } from "cf/config";

// A separate, non-indexable staging Worker. No live domain is attached here.
// Set resource IDs only after selecting the intended Cloudflare account.
export default defineConfig({
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  worker: defineWorker({
    name: "braeutigam-staging",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-06",
    compatibilityFlags: ["nodejs_compat"],
    workersDev: true,
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      IMAGES: bindings.images(),
      DB: bindings.d1({ name: "braeutigam-cms-staging", id: process.env.CLOUDFLARE_D1_ID }),
      RESUMES: bindings.r2({ name: "braeutigam-resumes-staging", jurisdiction: "eu" }),
      SESSION_SECRET: bindings.secret(),
      SITE_URL: bindings.text("https://www.braeutigam-gmbh.eu"),
      SITE_INDEXABLE: bindings.text("false"),
    },
  }),
});
