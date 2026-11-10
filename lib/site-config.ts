export function siteIndexable(): boolean {
  return process.env.SITE_INDEXABLE === "true";
}
