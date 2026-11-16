"use client";
import { defineI18nUI } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider/base";
import { type ReactNode, useEffect, useState } from "react";
import { i18n } from "@/lib/i18n";

// fumadocs-ui keys its texts by the English text plus a note on where it
// appears; the former `search` key covered both of these.
const { provider } = defineI18nUI(i18n, {
	de: {
		displayName: "Deutsch",
		"Search(search trigger)": "Suchen...",
		"Search(search dialog)": "Suchen...",
	},
});

function ShortcutDisplay() {
	const [modifier, setModifier] = useState("Ctrl");

	useEffect(() => {
		const platform =
			(navigator as Navigator & { userAgentData?: { platform?: string } })
				.userAgentData?.platform ??
			navigator.platform ??
			"";
		setModifier(/Mac|iPhone|iPad|iPod/i.test(platform) ? "⌘" : "Strg");
	}, []);

	return (
		<span className="inline-flex items-center gap-1">
			<span>{modifier}</span>
			<span>K</span>
		</span>
	);
}

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
						display: <ShortcutDisplay />,
						key: (e) => (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k",
					},
				],
			}}
			i18n={provider(lang)}
		>
			{children}
		</RootProvider>
	);
}
