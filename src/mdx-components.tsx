import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Mermaid } from "./components/mdx/mermaid";
import { Accordion, Accordions } from "./components/accordion";

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    // biome-ignore lint/suspicious/noExplicitAny: fumadocs
    img: (props) => <ImageZoom {...(props as any)} />,
    Mermaid,
    Accordions,
    Accordion,
    ...components,
  };
}
