export function siteIndexable(): boolean {
  return process.env.SITE_INDEXABLE === "true";
}

/** Public origin, shared by sitemap URLs and page metadata in both runtimes. */
export function siteOrigin(): string {
  const url = new URL(process.env.SITE_URL || "https://www.braeutigam-gmbh.eu");
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("SITE_URL must be an absolute HTTP or HTTPS URL.");
  }
  return url.origin;
}
