import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.beyondspacework.com",
        pathname: "/uploads/**",
      },
    ],
  },
  typescript: {
    // Disable TypeScript checks during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint checks during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
