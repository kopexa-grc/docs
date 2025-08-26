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
			transparentMode: "top",
			title: (
				<>
					<div className="size-8 rounded-md bg-primary-800 grid place-content-center">
						<span className="text-white">K</span>
					</div>
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
