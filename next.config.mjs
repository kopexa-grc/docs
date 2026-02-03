import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: "standalone",
  serverExternalPackages: ["shiki"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/de/platform",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/:lang/:path*.mdx",
        destination: "/:lang/llms.mdx/:path*",
      },
    ];
  },
};

export default withMDX(config);
