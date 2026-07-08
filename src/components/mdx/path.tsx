// Click-path / breadcrumb component for describing navigation in the app.
//
// Each item can carry a lucide icon name and a role:
//   - default:        a menu point (icon + label)
//   - entity: true    the transition into a concrete entity you pick from a
//                     list (dashed pill, italic) — signals "no longer a menu point"
//   - action: true    a button/control in the app (ghost button, icon + label)
//
// Usage in MDX:
//   <Path items={[
//     { label: "Einstellungen", icon: "Settings" },
//     { label: "Bewertung", icon: "Gauge" },
//   ]} />
//
//   <Path items={[
//     { label: "Organisation", icon: "PackageSearch" },
//     { label: "Prozesse", icon: "ListTodo" },
//     { label: "Prozess auswählen", entity: true },
//     { label: "Geschäftskontinuitätsmanagement (BCM)" },
//     { label: "Business Impact Analyse", icon: "Gauge", action: true },
//   ]} />
//
// Styling uses the shared theme tokens (Kopexa primary blue as accent), so it
// adapts to light/dark automatically and matches the app look. It stays compact
// and wraps on narrow screens (no fixed width).

import { ChevronRight, icons } from "lucide-react";

type PathItem = {
	label: string;
	icon?: keyof typeof icons;
	entity?: boolean;
	action?: boolean;
};

function LucideIcon({
	name,
	className,
}: {
	name?: keyof typeof icons;
	className?: string;
}) {
	if (!name) return null;
	const Cmp = icons[name];
	if (!Cmp) return null;
	return <Cmp aria-hidden={true} className={className} />;
}

export function Path({ items = [] }: { items?: PathItem[] }) {
	return (
		<div className="my-4 flex flex-wrap items-center gap-x-1 gap-y-1.5 rounded-lg border border-border bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
			{items.map((item, i) => (
				<span key={`${item.label}-${i}`} className="flex items-center">
					{i > 0 ? (
						<ChevronRight
							aria-hidden={true}
							className="mx-1 size-3.5 shrink-0 text-muted-foreground/50"
						/>
					) : null}
					{item.action ? (
						<span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 font-medium text-foreground shadow-sm">
							<LucideIcon name={item.icon} className="size-3.5 text-primary" />
							{item.label}
						</span>
					) : item.entity ? (
						<span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-primary/40 bg-primary/5 px-2 py-1 italic text-muted-foreground">
							<LucideIcon
								name={item.icon ?? "MousePointerClick"}
								className="size-3.5 text-primary/70"
							/>
							{item.label}
						</span>
					) : (
						<span className="inline-flex items-center gap-1.5 font-medium text-foreground">
							<LucideIcon
								name={item.icon}
								className="size-3.5 text-muted-foreground"
							/>
							{item.label}
						</span>
					)}
				</span>
			))}
		</div>
	);
}
