import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www\\.samajaay\\.com" }],
        destination: "https://samajaay.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
