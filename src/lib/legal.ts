export type LegalLink = {
	text: string;
	url: string;
	external?: boolean;
};

// Central list of legal links used in footers and other placements.
// For localization, you can switch URLs/texts based on a given locale.
export const legalLinks: LegalLink[] = [
	{
		text: "Impressum",
		url: "https://kopexa.com/de-de/legal/legal-notice",
		external: true,
	},
	{
		text: "Datenschutz",
		url: "https://kopexa.com/de-de/legal/privacy-policy",
		external: true,
	},
];
