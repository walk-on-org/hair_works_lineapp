import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
        }/api/:path*`,
      },
    ];
  },
  images: {
    domains: ["localhost", "staging.hair-work.jp", "hair-work.jp"],
  },
};

export default nextConfig;
