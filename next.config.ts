import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["jsmediatags", "@react-pdf/renderer"],
  // Polices et logo du PDF embarqués dans le bundle serverless Vercel.
  outputFileTracingIncludes: {
    "/api/invoices": ["./assets/**/*"],
  },
  turbopack: {},
  async redirects() {
    return [
      { source: "/perform", destination: "/", permanent: true },
      { source: "/accueil", destination: "/", permanent: true },
      { source: "/creation", destination: "/services", permanent: true },
      { source: "/teaching", destination: "/formations", permanent: true },
    ];
  },
};

export default nextConfig;
