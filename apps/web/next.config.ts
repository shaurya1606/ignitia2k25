import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    globalNotFound: true,
    // turbo pack caching
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
