import { defineI18nUI } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider/base";
import type { ReactNode } from "react";
import { i18n } from "@/lib/i18n";

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

export function Provider({
	children,
	lang,
}: {
	children: ReactNode;
	lang: string;
}) {
	return (
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
	);
}
