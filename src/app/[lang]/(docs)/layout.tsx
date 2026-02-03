import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

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
