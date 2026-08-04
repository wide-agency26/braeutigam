import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev server is often reached via a reverse-proxy hostname (e.g. the
  // demo zone). Without this, Next blocks /_next/webpack-hmr for that host.
  allowedDevOrigins: ["wide.demo-zone.site"],

  images: {
    // Default is ['image/webp']. AVIF is roughly 20% smaller and is preferred
    // when the browser advertises support, with WebP as the fallback.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
