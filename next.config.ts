import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF when the browser accepts it, WebP otherwise.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
