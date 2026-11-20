import type { MetadataRoute } from "next";
import { siteIndexable, siteOrigin } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (!siteIndexable()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/cms/",
    },
    sitemap: new URL("/sitemap.xml", siteOrigin()).href,
  };
}
