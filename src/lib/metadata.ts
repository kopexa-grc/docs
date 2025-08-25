import type { Metadata } from "next/types";

export function createMetadata(override: Metadata): Metadata {
	return {
		...override,
		openGraph: {
			title: override.title ?? undefined,
			description: override.description ?? undefined,
			url: "https://docs.kopexa.com",
			siteName: "Kopexa",
			...override.openGraph,
		},
		alternates: {
			...override.alternates,
		},
	};
}

export const baseUrl =
	process.env.NODE_ENV === "development" ||
	!process.env.VERCEL_PROJECT_PRODUCTION_URL
		? new URL("http://localhost:3000")
		: new URL(`https://docs.kopexa.com`);
