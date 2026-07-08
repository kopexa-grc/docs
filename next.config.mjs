import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: "standalone",
  serverExternalPackages: ["shiki"],
  async redirects() {
    // Preserve old article URLs after the IA restructure (SEO/GEO):
    // permanent (308) redirects from the pre-restructure paths to the new ones.
    // Locale is hidden for the default language, so canonical URLs are prefix-less
    // (/platform/…); we also map the /de/… form to land in a single hop.
    const movedPages = [
      ["/platform/compliance/documents", "/platform/documents"],
      ["/platform/compliance/documents/create", "/platform/documents/create"],
      ["/platform/compliance/documents/mapping", "/platform/documents/mapping"],
      ["/platform/compliance/documents/policies", "/platform/documents/policies"],
      ["/platform/compliance/documents/review", "/platform/documents/review"],
      ["/platform/compliance/vendors", "/platform/organization/vendors"],
      ["/platform/compliance/vendors/create", "/platform/organization/vendors/create"],
      ["/platform/compliance/vendors/detail", "/platform/organization/vendors/detail"],
      ["/platform/compliance/vendors/review", "/platform/organization/vendors/review"],
      [
        "/platform/compliance/vendors/best-practices",
        "/platform/organization/vendors/best-practices",
      ],
      ["/platform/compliance/inventory", "/platform/organization/assets"],
      ["/platform/compliance/inventory/people", "/platform/organization/people"],
    ];

    const movedRedirects = movedPages.flatMap(([from, to]) => [
      { source: from, destination: to, permanent: true },
      { source: `/de${from}`, destination: to, permanent: true },
    ]);

    return [
      {
        source: "/",
        destination: "/de/platform",
        permanent: false,
      },
      ...movedRedirects,
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
