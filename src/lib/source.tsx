import { docs } from "fumadocs-mdx:collections/server";
import { type LoaderPlugin, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { i18n } from "./i18n";

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
	// it assigns a URL to your pages
	baseUrl: "/",
	source: docs.toFumadocsSource(),
	i18n,
	plugins: [pageTreeCodeTitles(), lucideIconsPlugin()],
});

function pageTreeCodeTitles(): LoaderPlugin {
	return {
		transformPageTree: {
			file(node) {
				if (
					typeof node.name === "string" &&
					(node.name.endsWith("()") || node.name.match(/^<\w+ \/>$/))
				) {
					return {
						...node,
						name: <code className="text-[0.8125rem]">{node.name}</code>,
					};
				}
				return node;
			},
		},
	};
}
