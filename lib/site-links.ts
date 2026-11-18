/** Public social handles — hide footer links when URL is null. */
export const INSTAGRAM_HANDLE = "braeutigamgmbh";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

export const LINKEDIN_URL = "https://www.linkedin.com/company/102550870";

export const FACEBOOK_URL = "https://www.facebook.com/braeutigam.carbonfiber/";

export const SOCIAL_LINKS = [
  { label: "INSTAGRAM", href: INSTAGRAM_URL },
  { label: "LINKEDIN", href: LINKEDIN_URL },
  { label: "FACEBOOK", href: FACEBOOK_URL },
] as const;
