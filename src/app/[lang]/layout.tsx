import "@/app/global.css";
import { NextProvider } from "fumadocs-core/framework/next";
import { TreeContextProvider } from "fumadocs-ui/contexts/tree";
import { Inter } from "next/font/google";
import { BackgroundPattern } from "@/components/background-pattern";
import { source } from "@/lib/source";
import { Provider } from "./provider";

const inter = Inter({
	subsets: ["latin"],
});

export default async function Layout({
	params,
	children,
}: {
	params: Promise<{ lang: string }>;
	children: React.ReactNode;
}) {
	const lang = (await params).lang;

	return (
		<html lang={lang} className={inter.className} suppressHydrationWarning>
			<body className="flex flex-col min-h-screen" suppressHydrationWarning>
				<BackgroundPattern />
				<NextProvider>
					<TreeContextProvider tree={source.pageTree[lang]}>
						<Provider lang={lang}>{children}</Provider>
					</TreeContextProvider>
				</NextProvider>
			</body>
		</html>
	);
}
