export type Locale = "de" | "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export function localeFromPath(pathname: string): Locale {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  return "de";
}

/** Prefix or strip `/en` for a German canonical path (e.g. `/karriere`). */
export function localizedHref(path: string, locale: Locale): string {
  if (path.startsWith("http")) return path;
  const bare =
    path === "/en"
      ? "/"
      : path.startsWith("/en/")
        ? path.slice(3) || "/"
        : path;
  if (locale === "en") {
    return bare === "/" ? "/en" : `/en${bare}`;
  }
  return bare;
}

/** Same page in the other locale (no cookie redirects). */
export function switchLocalePath(pathname: string, target: Locale): string {
  return localizedHref(pathname, target);
}

export function persistLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;samesite=lax`;
}
