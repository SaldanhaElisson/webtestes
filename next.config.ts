import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbo: {
    rules: {
      // Add this if you need custom loader rules
      '*.mp4': {
        loaders: [{ loader: 'file-loader' }]
      }
    }
  }
};

export default nextConfig;
