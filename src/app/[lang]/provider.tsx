"use client";
import { defineI18nUI } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider/base";
import type { ReactNode } from "react";
import { i18n } from "@/lib/i18n";

const { provider } = defineI18nUI(i18n, {
	translations: {
		de: {
			displayName: "Deutsch",
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
						key: (e) =>
							(e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k",
					},
				],
			}}
			i18n={provider(lang)}
		>
			{children}
		</RootProvider>
	);
}
