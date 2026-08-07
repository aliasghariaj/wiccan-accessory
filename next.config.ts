import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "acdnvbiathobskamispz.supabase.co",
      },
    ],
  },
};

export default nextConfig;