import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Audio lesson uploads are capped at 60MB (see src/lib/resource-constraints.ts),
      // the largest upload type; this leaves headroom for multipart overhead.
      bodySizeLimit: "65mb",
    },
  },
};

export default nextConfig;
