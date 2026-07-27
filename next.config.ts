import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Resource uploads are capped at 25MB (see src/lib/resource-constraints.ts);
      // this leaves headroom for multipart/form-data boundary overhead.
      bodySizeLimit: "26mb",
    },
  },
};

export default nextConfig;
