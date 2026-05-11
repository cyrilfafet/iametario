import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // jsmediatags pulls in react-native-fs which doesn't exist in a web context
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-native-fs": false,
    };
    return config;
  },
};

export default nextConfig;
