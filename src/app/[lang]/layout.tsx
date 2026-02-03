import "@/app/global.css";
import { NextProvider } from "fumadocs-core/framework/next";
import { TreeContextProvider } from "fumadocs-ui/contexts/tree";
import { source } from "@/lib/source";
import { Provider } from "./provider";

export default async function Layout({
	params,
	children,
}: {
	params: Promise<{ lang: string }>;
	children: React.ReactNode;
}) {
	const lang = (await params).lang;

	return (
		<html lang={lang} suppressHydrationWarning>
			<body className="flex flex-col min-h-screen bg-fd-muted font-sans" suppressHydrationWarning>
				<NextProvider>
					<TreeContextProvider tree={source.pageTree[lang]}>
						<Provider lang={lang}>{children}</Provider>
					</TreeContextProvider>
				</NextProvider>
			</body>
		</html>
	);
}
