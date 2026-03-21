import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  reactCompiler: {
    compilationMode: 'annotation',
  },
};

export default nextConfig;
