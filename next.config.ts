import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // jsmediatags is client-only — exclude it from the server bundle to avoid
  // its react-native-fs dependency causing a build error under Turbopack
  serverExternalPackages: ["jsmediatags"],
  turbopack: {},
};

export default nextConfig;
