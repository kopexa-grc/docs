import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { baseOptions } from "@/lib/layout.shared";
import { baseUrl, createMetadata } from "@/lib/metadata";
import { source } from "@/lib/source";

export const metadata: Metadata = {
  metadataBase: baseUrl,
  ...createMetadata({
    title: {
      default: "Kopexa Docs",
      template: "%s | Kopexa Docs",
    },
    description: "GRC Platform für moderne Unternehmen - Compliance, Risikomanagement und Governance einfach gemacht.",
  }),
};

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;

  const { nav, ...base } = baseOptions(lang);

  return (
    <div className="docs-layout">
      <DocsLayout
        {...base}
        nav={{
          ...nav,
          title: (
            <>
              <span className="font-medium max-md:hidden">Kopexa</span>
            </>
          ),
        }}
        tree={source.pageTree[lang]}
        sidebar={{
          footer: null, // Remove default footer from sidebar
        }}
      >
        {children}
      </DocsLayout>
      <Footer />
    </div>
  );
}
