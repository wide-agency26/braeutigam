/** Public social handles — hide footer links when URL is null. */
export const INSTAGRAM_HANDLE = "braeutigamgmbh";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

// TODO(client): confirm LinkedIn company URL
export const LINKEDIN_URL: string | null = null;

// TODO(client): confirm Facebook page URL
export const FACEBOOK_URL: string | null = null;

export const SOCIAL_LINKS = [
  { label: "INSTAGRAM", href: INSTAGRAM_URL },
  { label: "LINKEDIN", href: LINKEDIN_URL },
  { label: "FACEBOOK", href: FACEBOOK_URL },
] as const;
