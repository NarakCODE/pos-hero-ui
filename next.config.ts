import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "shadcn-nextjs-restropos-admin-template.vercel.app",
      },
      {
        protocol: "https",
        hostname: "shadcn-nextjs-restropos-admin-template.vercel.app",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
