import type { NextConfig } from "next";

const supabaseImageUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;

const nextConfig: NextConfig = {
  devIndicators: false,
  images: supabaseImageUrl
    ? {
        remotePatterns: [
          {
            protocol: new URL(supabaseImageUrl).protocol.replace(
              ":",
              "",
            ) as "http" | "https",
            hostname: new URL(supabaseImageUrl).hostname,
            pathname: "/storage/v1/**",
          },
        ],
      }
    : undefined,
};

export default nextConfig;
