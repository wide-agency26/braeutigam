import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev server is often reached via a reverse-proxy hostname (e.g. the
  // demo zone). Without this, Next blocks /_next/webpack-hmr for that host.
  allowedDevOrigins: ["wide.demo-zone.site"],

  serverExternalPackages: ["@prisma/client", "prisma"],

  experimental: {
    serverActions: {
      bodySizeLimit: "4.5mb",
    },
  },

  async redirects() {
    return [
      { source: "/admin", destination: "/cms/admin", permanent: false },
      { source: "/admin/:path*", destination: "/cms/admin/:path*", permanent: false },
    ];
  },

  images: {
    remotePatterns: process.env.SUPABASE_URL ? [{
      protocol: new URL(process.env.SUPABASE_URL).protocol === "https:" ? "https" : "http",
      hostname: new URL(process.env.SUPABASE_URL).hostname,
      port: new URL(process.env.SUPABASE_URL).port,
      pathname: "/storage/v1/object/public/site-media/**",
      search: "",
    }] : [],
    // WebP avoids the much slower first-request AVIF encoding and duplicate
    // format caches. Responsive resizing still keeps delivered images small.
    formats: ["image/webp"],
  },
};

export default nextConfig;
