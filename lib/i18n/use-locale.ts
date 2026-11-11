"use client";

import { usePathname } from "next/navigation";
import { localeFromPath, type Locale } from "./paths";

export function useSiteLocale(): Locale {
  const pathname = usePathname() ?? "/";
  return localeFromPath(pathname);
}
