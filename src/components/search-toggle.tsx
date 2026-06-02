"use client";
import { useI18n } from "fumadocs-ui/contexts/i18n";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { Search } from "lucide-react";
import { type ComponentProps, useEffect, useState } from "react";
import { cn } from "../lib/cn";
import { type ButtonProps, buttonVariants } from "./ui/button";

function useModifierLabel() {
	const [label, setLabel] = useState("Ctrl");

	useEffect(() => {
		const platform =
			(navigator as Navigator & { userAgentData?: { platform?: string } })
				.userAgentData?.platform ??
			navigator.platform ??
			"";
		setLabel(/Mac|iPhone|iPad|iPod/i.test(platform) ? "⌘" : "Strg");
	}, []);

	return label;
}

interface SearchToggleProps
	extends Omit<ComponentProps<"button">, "color">,
		ButtonProps {
	hideIfDisabled?: boolean;
}

export function SearchToggle({
	hideIfDisabled,
	size = "icon-sm",
	color = "ghost",
	...props
}: SearchToggleProps) {
	const { setOpenSearch, enabled } = useSearchContext();
	if (hideIfDisabled && !enabled) return null;

	return (
		<button
			type="button"
			className={cn(
				buttonVariants({
					size,
					color,
				}),
				props.className,
			)}
			data-search=""
			aria-label="Open Search"
			onClick={() => {
				setOpenSearch(true);
			}}
		>
			<Search />
		</button>
	);
}

export function LargeSearchToggle({
	hideIfDisabled,
	...props
}: ComponentProps<"button"> & {
	hideIfDisabled?: boolean;
}) {
	const { enabled, hotKey, setOpenSearch } = useSearchContext();
	const { text } = useI18n();
	const modifier = useModifierLabel();
	if (hideIfDisabled && !enabled) return null;

	return (
		<button
			type="button"
			data-search-full=""
			{...props}
			className={cn(
				"inline-flex items-center gap-2 rounded-lg border bg-fd-secondary/50 p-1.5 ps-2 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground",
				props.className,
			)}
			onClick={() => {
				setOpenSearch(true);
			}}
		>
			<Search className="size-4" />
			{text.search}
			<div className="ms-auto inline-flex gap-0.5">
				<kbd className="rounded-md border bg-fd-background px-1.5">
					{modifier}
				</kbd>
				{hotKey.map((k, i) => (
					<kbd
						key={i.toString()}
						className="rounded-md border bg-fd-background px-1.5"
					>
						{k.display}
					</kbd>
				))}
			</div>
		</button>
	);
}
