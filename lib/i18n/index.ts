import type { Locale } from "./paths";
import type { Dictionary } from "./types";
import { applyDe, chromeDe, jobDetailDe } from "./de";
import { applyEn, chromeEn, jobDetailEn } from "./en";

export function getDictionary(locale: Locale): Dictionary {
  if (locale === "en") {
    return {
      chrome: chromeEn,
      apply: applyEn,
      jobDetail: jobDetailEn,
    };
  }
  return {
    chrome: chromeDe,
    apply: applyDe,
    jobDetail: jobDetailDe,
  };
}

export type { Locale } from "./paths";
export {
  LOCALE_COOKIE,
  localeFromPath,
  localizedHref,
  persistLocaleCookie,
  switchLocalePath,
} from "./paths";
