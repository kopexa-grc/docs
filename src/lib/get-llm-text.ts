import { remarkNpm } from "fumadocs-core/mdx-plugins";
import type { InferPageType } from "fumadocs-core/source";
import { remarkInclude } from "fumadocs-mdx/config";
import { remarkAutoTypeTable } from "fumadocs-typescript";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import type { source } from "./source";

const processor = remark()
	.use(remarkMdx)
	.use(remarkInclude)
	.use(remarkGfm)
	.use(remarkAutoTypeTable)
	.use(remarkNpm);

export async function getLLMText(page: InferPageType<typeof source>) {
	const category =
		{
			core: "Kopexa",
		}[page.slugs[0]] ?? page.slugs[0];

	const processed = await processor.process({
		path: page.data._file.absolutePath,
		value: page.data.content,
	});

	return `# ${category}: ${page.data.title}
URL: ${page.url}
Source: https://raw.githubusercontent.com/kopexa-grc/docs/refs/heads/main/content/${page.path}

${page.data.description}
        
${processed.value}`;
}
