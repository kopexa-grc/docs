import type { Metadata } from "next/types";

export const baseUrl = new URL(
	process.env.NODE_ENV === "production"
		? "https://docs.kopexa.com"
		: "http://localhost:3000"
);

interface CreateMetadataOptions extends Metadata {
	slug?: string;
}

/**
 * Create metadata for pages with dynamic OG images.
 * Uses /api/og route for image generation.
 */
export function createMetadata(override: CreateMetadataOptions): Metadata {
	const title = typeof override.title === "string" ? override.title : "Kopexa Documentation";
	const description = override.description ?? "GRC Platform für moderne Unternehmen";
	const slug = override.slug ?? "";

	// Determine type based on slug
	const ogType = slug.startsWith("platform")
		? "platform"
		: slug.startsWith("catalogs")
			? "catalog"
			: slug.startsWith("integrations")
				? "integrations"
				: "docs";

	// Build relative OG image URL (metadataBase will make it absolute)
	const ogImageParams = new URLSearchParams({
		title,
		description: description ?? "",
		type: ogType,
	});
	const ogImageUrl = `/api/og?${ogImageParams.toString()}`;

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
					url: ogImageUrl,
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
			images: [ogImageUrl],
			...override.twitter,
		},
		alternates: {
			...override.alternates,
		},
	};
}
