import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { AppWindow } from "lucide-react";
import { i18n } from "./i18n";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function baseOptions(_locale: string): BaseLayoutProps {
	return {
		i18n,
		nav: {
			title: (
				<>
					<svg
						width="24"
						height="24"
						xmlns="http://www.w3.org/2000/svg"
						aria-label="Logo"
					>
						<title>Kopexa</title>
						<circle cx={12} cy={12} r={12} fill="currentColor" />
					</svg>
					Kopexa
				</>
			),
		},
		// see https://fumadocs.dev/docs/ui/navigation/links
		links: [
			{
				icon: <AppWindow />,
				text: "App",
				url: "https://app.kopexa.com",
				// secondary items will be displayed differently on navbar
				secondary: true,
			},
		],
		githubUrl: "https://github.com/kopexa-grc",
	};
}
