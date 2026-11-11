export type SiteNavItem = {
  /** English menu label (header / footer in EN mode). */
  labelEn: string;
  href?: string;
  soon?: boolean;
  /** German document title segment (without site suffix). */
  titleDe: string;
};

/** Primary site navigation — same order everywhere. */
export const SITE_NAV: SiteNavItem[] = [
  { labelEn: "HOME", href: "/", titleDe: "Start" },
  { labelEn: "JOIN US", href: "/karriere", titleDe: "Karriere" },
  { labelEn: "TEAM", href: "/team", titleDe: "Experten" },
  { labelEn: "CRAFT", soon: true, titleDe: "Leistungen" },
  { labelEn: "CONTACT", href: "/kontakt", titleDe: "Kontakt" },
];

export const SITE_TITLE_SUFFIX = "Bräutigam GmbH";

const PAGE_TITLE_EN: Record<string, string> = {
  Start: "Home",
  Karriere: "Careers",
  Experten: "Team",
  Leistungen: "Craft",
  Kontakt: "Contact",
  Impressum: "Imprint",
  Datenschutz: "Privacy",
};

export function pageTitle(titleDe: string) {
  return `${titleDe} | ${SITE_TITLE_SUFFIX}`;
}

export function pageTitleForLocale(titleDe: string, locale: "de" | "en") {
  if (locale === "en") {
    const en = PAGE_TITLE_EN[titleDe] ?? titleDe;
    return `${en} | ${SITE_TITLE_SUFFIX}`;
  }
  return pageTitle(titleDe);
}

export function jobPageTitle(jobTitle: string) {
  return `${jobTitle} | Karriere | ${SITE_TITLE_SUFFIX}`;
}

export function jobPageTitleForLocale(jobTitle: string, locale: "de" | "en") {
  if (locale === "en") {
    return `${jobTitle} | Careers | ${SITE_TITLE_SUFFIX}`;
  }
  return jobPageTitle(jobTitle);
}
