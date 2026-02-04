import type { Metadata } from "next/types";

export const baseUrl =
	process.env.NODE_ENV === "development" ||
	!process.env.VERCEL_PROJECT_PRODUCTION_URL
		? new URL("http://localhost:3000")
		: new URL(`https://docs.kopexa.com`);

interface CreateMetadataOptions extends Metadata {
	ogType?: "docs" | "platform" | "catalog" | "integrations";
}

export function createMetadata(override: CreateMetadataOptions): Metadata {
	const title = typeof override.title === "string" ? override.title : "Kopexa Documentation";
	const description = override.description ?? "GRC Platform für moderne Unternehmen";
	const ogType = override.ogType ?? "docs";

	// Build OG image URL with parameters
	const ogImageUrl = new URL("/api/og", baseUrl);
	ogImageUrl.searchParams.set("title", title);
	if (description) ogImageUrl.searchParams.set("description", description);
	ogImageUrl.searchParams.set("type", ogType);

	return {
		...override,
		openGraph: {
			title,
			description,
			url: "https://docs.kopexa.com",
			siteName: "Kopexa Docs",
			type: "website",
			images: [
				{
					url: ogImageUrl.toString(),
					width: 1200,
					height: 630,
					alt: title,
				},
			],
			...override.openGraph,
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [ogImageUrl.toString()],
			...override.twitter,
		},
		alternates: {
			...override.alternates,
		},
	};
}

/**
 * Generate OG image URL for a specific page
 */
export function getOgImageUrl(
	title: string,
	description?: string,
	type: "docs" | "platform" | "catalog" | "integrations" = "docs"
): string {
	const ogImageUrl = new URL("/api/og", baseUrl);
	ogImageUrl.searchParams.set("title", title);
	if (description) ogImageUrl.searchParams.set("description", description);
	ogImageUrl.searchParams.set("type", type);
	return ogImageUrl.toString();
}
