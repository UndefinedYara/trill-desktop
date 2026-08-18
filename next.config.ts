import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  // @xenova/transformers relies on this to be left out of the bundle 
  // and processed as an external dependency instead
  serverExternalPackages: ["onnxruntime-node"],
};

export default nextConfig;
