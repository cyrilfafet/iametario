import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["jsmediatags"],
  turbopack: {},
  async redirects() {
    return [
      { source: "/perform", destination: "/accueil", permanent: true },
      { source: "/creation", destination: "/services", permanent: true },
      { source: "/teaching", destination: "/formations", permanent: true },
    ];
  },
};

export default nextConfig;
