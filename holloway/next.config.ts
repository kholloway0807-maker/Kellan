import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // this app lives beside an unrelated Vite project in the same repo
  turbopack: { root: __dirname },
  images: {
    // Placeholder photography source. Swap these for real brand photography
    // before launch; the seeds keep each slot stable in the meantime.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
