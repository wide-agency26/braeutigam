# Sitemap and launch configuration

`/sitemap.xml` contains the seven public page pairs (DE/EN) and both language versions of every published job. Entries link reciprocally to their German and English alternatives, including `/impressum` ↔ `/en/imprint` and `/datenschutz` ↔ `/en/privacy`. CMS, API, draft/closed jobs and legacy redirect URLs are excluded.

The sitemap is generated at request time, so published, closed, renamed or deleted jobs are reflected without rebuilding. Job `lastmod` values come from their database update timestamps; static pages do not use invented modification dates. A database failure fails the request rather than returning a misleading partial sitemap.

While `SITE_INDEXABLE` is unset or false, the sitemap is empty and robots.txt disallows crawling without advertising a sitemap. Existing noindex headers and page metadata stay in place.

At approved production go-live:

1. Set `SITE_URL` to the final canonical origin (currently `https://www.braeutigam-gmbh.eu`). Keep preview/staging `SITE_INDEXABLE=false`.
2. Set `SITE_INDEXABLE=true` in the production environment and rebuild/deploy so page metadata and crawl policy agree.
3. Verify production `/robots.txt` advertises `/sitemap.xml`, the XML contains the expected published jobs, and listed pages return 200 without noindex.
4. Submit the production sitemap in Google Search Console after verifying ownership. No submission or indexing enablement is performed by this change.

The Next.js/Postgres and Cloudflare/D1 builds use the same published-job query through the existing database adapter. No schema, storage or security-policy changes are required.

## Verification — 20 November 2026

- `node scripts/verify-sitemap.mjs`: pre-launch gating, reciprocal locale pairs, published-only jobs, publication/rename/deletion freshness, real job timestamps and database failure handling.
- Next.js production build, Cloudflare build, TypeScript and scoped ESLint.
- Local production HTTP checks: valid sitemap XML, robots discovery, and successful responses for all 14 static public URLs; Cloudflare additionally included both language versions of the local published-job fixture (16 URLs total).
- A separate noindex-mode server returned an empty XML sitemap, the existing noindex response header and robots.txt without a sitemap directive. No production data or indexing settings were changed.
