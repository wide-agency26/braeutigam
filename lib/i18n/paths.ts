export type Locale = "de" | "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";

/** German canonical path → English slug (legal pages differ). */
const LEGAL_EN: Record<string, string> = {
  "/impressum": "/imprint",
  "/datenschutz": "/privacy",
};

const LEGAL_DE: Record<string, string> = {
  "/imprint": "/impressum",
  "/privacy": "/datenschutz",
};

export function localeFromPath(pathname: string): Locale {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  return "de";
}

function stripEnPrefix(path: string): string {
  if (path === "/en") return "/";
  if (path.startsWith("/en/")) return path.slice(3) || "/";
  return path;
}

/** Map any path to its German canonical segment (for locale switching). */
function canonicalDePath(path: string): string {
  const bare = stripEnPrefix(path);
  return LEGAL_DE[bare] ?? bare;
}

function pathForLocale(deCanonical: string, locale: Locale): string {
  if (locale === "en") {
    const enPath = LEGAL_EN[deCanonical] ?? deCanonical;
    return enPath === "/" ? "/en" : `/en${enPath}`;
  }
  return deCanonical;
}

/** Prefix or strip `/en` for a German canonical path (e.g. `/karriere`). */
export function localizedHref(path: string, locale: Locale): string {
  if (path.startsWith("http")) return path;
  return pathForLocale(canonicalDePath(path), locale);
}

/** Same page in the other locale (no cookie redirects). */
export function switchLocalePath(pathname: string, target: Locale): string {
  return pathForLocale(canonicalDePath(pathname), target);
}

export function persistLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
}
