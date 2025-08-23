import "@/app/global.css";
import { defineI18nUI } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider";
import { Inter } from "next/font/google";
import { i18n } from "@/lib/i18n";

const inter = Inter({
	subsets: ["latin"],
});

const { provider } = defineI18nUI(i18n, {
	translations: {
		en: {
			displayName: "English",
		},
		de: {
			displayName: "German",
			search: "Suchen...",
		},
	},
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
			<body className="flex flex-col min-h-screen">
				<RootProvider
					search={{
						enabled: true,
						hotKey: [
							{
								display: "K",
								key: "k", // key code, or a function determining whether the key is pressed
							},
						],
					}}
					i18n={provider(lang)}
				>
					{children}
				</RootProvider>
			</body>
		</html>
	);
}
