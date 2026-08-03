import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Default is ['image/webp']. AVIF is roughly 20% smaller and is preferred
    // when the browser advertises support, with WebP as the fallback.
    // Note: if this is ever served from behind a proxy/CDN, that proxy must
    // forward the Accept header for the negotiation to work.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
