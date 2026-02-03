import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Accordion, Accordions } from "./components/accordion";
import { Mermaid } from "./components/mdx/mermaid";
import { FeatureCard, FeatureCards } from "./components/mdx/feature-card";
import {
	H1,
	H2,
	H3,
	H4,
	H5,
	H6,
	P,
	Strong,
	Em,
	UL,
	OL,
	LI,
	A,
	Blockquote,
	HR,
	Table,
	THead,
	TBody,
	TR,
	TH,
	TD,
} from "./components/mdx/typography";

// Custom typography components for better readability (Mistral-inspired)
// Note: We don't override 'code' here as fumadocs handles code blocks specially
const typographyComponents = {
	h1: H1,
	h2: H2,
	h3: H3,
	h4: H4,
	h5: H5,
	h6: H6,
	p: P,
	strong: Strong,
	em: Em,
	ul: UL,
	ol: OL,
	li: LI,
	a: A,
	blockquote: Blockquote,
	hr: HR,
	table: Table,
	thead: THead,
	tbody: TBody,
	tr: TR,
	th: TH,
	td: TD,
};

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...defaultMdxComponents,
		...typographyComponents,
		// biome-ignore lint/suspicious/noExplicitAny: fumadocs
		img: (props) => <ImageZoom {...(props as any)} />,
		Mermaid,
		Accordions,
		Accordion,
		FeatureCard,
		FeatureCards,
		...components,
	};
}
