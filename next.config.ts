import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/aiventurelens",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
