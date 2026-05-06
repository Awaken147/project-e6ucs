import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No output config needed — Vercel handles serverless automatically
  // "standalone" is for self-hosted only and causes 404 on Vercel
  reactStrictMode: true,
};

export default nextConfig;
