import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";
import { LegalFooter } from "@/components/LegalFooter";
import { baseOptions } from "@/lib/layout.shared";

export default async function Layout({
	params,
	children,
}: {
	params: Promise<{ lang: string }>;
	children: ReactNode;
}) {
	const { lang } = await params;

	return (
		<HomeLayout {...baseOptions(lang)}>
			{children}
			<LegalFooter lang={lang} />
		</HomeLayout>
	);
}
