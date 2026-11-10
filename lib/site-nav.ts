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

export function pageTitle(titleDe: string) {
  return `${titleDe} | ${SITE_TITLE_SUFFIX}`;
}

export function jobPageTitle(jobTitle: string) {
  return `${jobTitle} | Karriere | ${SITE_TITLE_SUFFIX}`;
}
