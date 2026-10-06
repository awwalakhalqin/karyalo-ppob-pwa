import type { NextConfig } from "next";

/** Same minimal setup as Karyalo Manage: no external image hosts, manual PWA manifest. */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default nextConfig;
