import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  serverExternalPackages: ["onnxruntime-node"],
  outputFileTracingExcludes: {
    "/*": ["./node_modules/onnxruntime-node/**/*"],
  },
  output: "standalone",
};

export default nextConfig;
