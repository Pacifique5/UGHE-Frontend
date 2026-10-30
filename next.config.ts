import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A lockfile outside this project was being treated as the app root.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
