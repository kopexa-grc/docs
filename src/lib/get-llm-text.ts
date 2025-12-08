import type { InferPageType } from "fumadocs-core/source";
import type { source } from "./source";

export async function getLLMText(page: InferPageType<typeof source>) {
	const category =
		{
			core: "Kopexa",
		}[page.slugs[0]] ?? page.slugs[0];

	const processed = await page.data.getText("processed");

	return `# ${category}: ${page.data.title}
URL: ${page.url}
Source: https://raw.githubusercontent.com/kopexa-grc/docs/refs/heads/main/content/${page.path}

${page.data.description}
        
${processed}`;
}
