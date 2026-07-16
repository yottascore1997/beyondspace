// Polyfill URL.canParse for older Node.js versions
if (typeof URL !== 'undefined' && !URL.canParse) {
  URL.canParse = function (url: string | URL, base?: string | URL) {
    try {
      new URL(url, base);
      return true;
    } catch {
      return false;
    }
  };
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.beyondspacework.in",
      },
      // Old domain kept so previously saved image URLs keep working
      {
        protocol: "https",
        hostname: "files.yottascore.com",
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
