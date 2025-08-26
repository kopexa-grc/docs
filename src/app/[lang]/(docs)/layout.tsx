import type { ReactNode } from "react";
import { LegalFooter } from "@/components/LegalFooter";
import { DocsLayout } from "@/components/layout/docs";
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
		<DocsLayout
			{...base}
			tabMode="navbar"
			nav={{ ...nav, mode: "top" }}
			tree={source.pageTree[lang]}
		>
			{children}
			<LegalFooter lang={lang} />
		</DocsLayout>
	);
}
