import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LLMCopyButton, ViewOptions } from "@/components/page-actions";
import { createMetadata } from "@/lib/metadata";
import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

type Props = {
	params: Promise<{ lang: string; slug?: string[] }>;
};

export default async function Page({ params }: Props) {
	const { slug, lang } = await params;
	const page = source.getPage(slug, lang);

	if (!page) notFound();

	const { body: MDXContent, toc, lastModified } = await page.data.load();

	return (
		<DocsPage toc={toc}>
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription className="mb-0">
				{page.data.description}
			</DocsDescription>
			<div className="flex flex-row gap-2 items-center border-b pt-2 pb-6">
				<LLMCopyButton markdownUrl={`${page.url}.mdx`} />
				<ViewOptions
					markdownUrl={`${page.url}.mdx`}
					githubUrl={`https://github.com/kopexa-grc/docs/blob/main/content/docs/${page.path}`}
				/>
			</div>
			<DocsBody>
				<MDXContent
					components={getMDXComponents({
						// this allows you to link to other pages with relative file paths
						a: createRelativeLink(source, page),
					})}
				/>
			</DocsBody>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	const params = await props.params;
	const page = source.getPage(params.slug, params.lang);
	if (!page) notFound();

	// Determine OG type based on URL path
	const slug = params.slug?.join("/") ?? "";
	const ogType = slug.startsWith("platform")
		? "platform"
		: slug.startsWith("catalogs")
			? "catalog"
			: slug.startsWith("integrations")
				? "integrations"
				: "docs";

	return createMetadata({
		title: page.data.title,
		description: page.data.description,
		ogType,
	});
}
