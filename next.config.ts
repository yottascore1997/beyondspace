import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
