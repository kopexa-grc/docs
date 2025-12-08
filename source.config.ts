import { rehypeCode } from "fumadocs-core/mdx-plugins";
import {
	defineConfig,
	defineDocs,
	frontmatterSchema,
	metaSchema,
} from "fumadocs-mdx/config";
import jsonSchema from "fumadocs-mdx/plugins/json-schema";
import lastModified from "fumadocs-mdx/plugins/last-modified";
import { z } from "zod";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections#define-docs
export const docs = defineDocs({
	docs: {
		schema: frontmatterSchema,
		postprocess: {
			includeProcessedMarkdown: true,
		},
		async: true,
	},
	meta: {
		schema: metaSchema.extend({
			description: z.string().optional(),
		}),
	},
});

export default defineConfig({
	plugins: [
		jsonSchema({
			insert: true,
		}),
		lastModified(),
	],
	// lastModifiedTime: "git",
	mdxOptions: {
		rehypePlugins: (v) => [rehypeCode, ...v],
	},
});
