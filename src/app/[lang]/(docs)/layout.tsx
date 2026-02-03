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
		<DocsLayout
			{...base}
			//tabMode="top"
			nav={{
				...nav,
				title: (
					<>
						<span className="font-medium in-[.uwu]:hidden max-md:hidden">
							Kopexa
						</span>
					</>
				),
			}}
			tree={source.pageTree[lang]}
		>
			{children}
			<Footer />
		</DocsLayout>
	);
}
