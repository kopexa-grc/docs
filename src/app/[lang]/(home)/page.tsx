import {
	ArrowRight,
	Boxes,
	ClipboardList,
	FileCheck2,
	Files,
	Layers,
	Rocket,
	ShieldCheck,
	Users,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
	return (
		<main className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center px-6 py-16 bg-gradient-to-b from-fd-background to-fd-muted">
			{/* Hero */}
			<section className="w-full max-w-6xl text-center">
				<p className="mx-auto inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-3 py-1 text-xs font-medium text-fd-muted-foreground">
					<ShieldCheck className="h-3.5 w-3.5" aria-hidden />
					ISMS & DSMS mit Kopexa – sicher, skalierbar, auditbereit
				</p>

				<h1 className="mx-auto mt-5 max-w-3xl text-pretty text-4xl font-extrabold tracking-tight text-fd-foreground md:text-6xl">
					Kopexa&nbsp;Docs
				</h1>

				<p className="mx-auto mt-4 max-w-3xl text-balance text-lg text-fd-muted-foreground md:text-xl">
					Das Handbuch für Teams aus IT, Informationssicherheit, Datenschutz,
					Beratung und Fachbereichen. Lerne Kopexa schnell kennen und baue
					Schritt für Schritt ein{" "}
					<span className="font-semibold text-fd-foreground">ISMS/DSMS</span>{" "}
					auf.
				</p>

				{/* Primary CTAs */}
				<div className="mx-auto mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
					<CTA href="/docs/core" variant="primary">
						Doku starten <ArrowRight className="ml-1.5 h-4 w-4" />
					</CTA>
					<CTA href="/docs/core/organization" variant="ghost">
						Erste Schritte: Organization
					</CTA>
					<CTA href="/docs/core/organization/domains/setup" variant="ghost">
						SSO & Domains einrichten
					</CTA>
				</div>

				{/* Trust highlights */}
				<div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-fd-muted-foreground">
					<Badge>EU-Hosting: Paris & Frankfurt (OVH)</Badge>
					<Badge>SAML/OIDC für alle Tarife</Badge>
					<Badge>ReBAC mit OpenFGA</Badge>
					<Badge>Backups + WAL, 30d + 30d Archiv</Badge>
				</div>
			</section>

			{/* Highlights */}
			<section className="mt-14 w-full max-w-6xl">
				<div className="grid gap-6 sm:grid-cols-3">
					<FeatureCard
						icon={<Layers className="h-6 w-6" aria-hidden />}
						title="Klarer Aufbau"
						description="Organizations & Spaces trennen Verantwortlichkeiten, Daten und Workflows – ideal für KMU bis Enterprise."
					/>
					<FeatureCard
						icon={<ShieldCheck className="h-6 w-6" aria-hidden />}
						title="Security by Design"
						description="OWASP-orientierte Architektur, verschlüsselte Datenhaltung in der EU, SSO für jedes Team."
					/>
					<FeatureCard
						icon={<Rocket className="h-6 w-6" aria-hidden />}
						title="Schnell produktiv"
						description="Geführte Setups, Screenshots, Checklisten – so bist du in Minuten startklar."
					/>
				</div>
			</section>

			{/* Quickstart */}
			<section className="mt-16 w-full max-w-6xl">
				<h2 className="text-2xl font-bold text-fd-foreground">Quickstart</h2>
				<p className="mt-1 text-sm text-fd-muted-foreground">
					Der schnellste Weg von 0 auf auditbereit – führe diese Schritte in
					Reihenfolge aus.
				</p>

				<ol className="mt-6 grid gap-4 md:grid-cols-2">
					<GuideStep
						index={1}
						title="Organization anlegen & Domain verifizieren"
						to="/docs/core/organization/domains/setup"
					/>
					<GuideStep
						index={2}
						title="SSO mit Entra ID verbinden"
						to="/docs/core/organization/domains/entra"
					/>
					<GuideStep
						index={3}
						title="Ersten Space erstellen"
						to="/docs/core/spaces"
					/>
					<GuideStep
						index={4}
						title="Inventory befüllen (Assets, Domains)"
						to="/docs/core/spaces/inventory"
					/>
					<GuideStep
						index={5}
						title="Frameworks & Kontrollen wählen"
						to="/docs/core/spaces" // update to catalogs-controls once available
					/>
					<GuideStep
						index={6}
						title="Risiken bewerten & Maßnahmen planen"
						to="/docs/core/spaces" // update to risks once available
					/>
					<GuideStep
						index={7}
						title="Nachweise verlinken (Documents & Evidence)"
						to="/docs/core/spaces" // update to documents-evidence once available
					/>
					<GuideStep
						index={8}
						title="Aufgaben im Board steuern (Work Items)"
						to="/docs/core/spaces" // update to issues once available
					/>
				</ol>
			</section>

			{/* Modules */}
			<section className="mt-16 w-full max-w-6xl">
				<h2 className="text-2xl font-bold text-fd-foreground">Kernmodule</h2>
				<p className="mt-1 text-sm text-fd-muted-foreground">
					Die wichtigsten Bereiche in Kopexa – mit Kontext, Beispielen und Best
					Practices.
				</p>

				<div className="mt-6 grid gap-6 md:grid-cols-3">
					<ModuleCard
						href="/docs/core/spaces/inventory"
						icon={<Boxes className="h-5 w-5" aria-hidden />}
						title="Inventory"
						description="Assets, Services & Internet-Domains verwalten. Grundlage für Risiken, Kontrollen, Evidences."
					/>
					<ModuleCard
						href="/docs/core/spaces" // update to risks
						icon={<ShieldCheck className="h-5 w-5" aria-hidden />}
						title="Risks"
						description="Risiken identifizieren, bewerten und mit Assets/Controls verknüpfen."
					/>
					<ModuleCard
						href="/docs/core/spaces" // update to vendors
						icon={<Users className="h-5 w-5" aria-hidden />}
						title="Vendors"
						description="Dienstleister & Partner zentral managen, Due Diligence nachweisen."
					/>
					<ModuleCard
						href="/docs/core/spaces" // update to catalogs-controls
						icon={<ClipboardList className="h-5 w-5" aria-hidden />}
						title="Catalogs & Controls"
						description="Frameworks nutzen und eigene Kontrollkataloge abbilden."
					/>
					<ModuleCard
						href="/docs/core/spaces" // update to documents-evidence
						icon={<Files className="h-5 w-5" aria-hidden />}
						title="Documents & Evidence"
						description="Richtlinien, Nachweise & Versionen auditfest dokumentieren."
					/>
					<ModuleCard
						href="/docs/core/spaces" // update to issues
						icon={<FileCheck2 className="h-5 w-5" aria-hidden />}
						title="Work Items"
						description="Maßnahmen & Findings im Board planen und verfolgen."
					/>
				</div>
			</section>

			{/* Footer CTA */}
			<section className="mt-16 w-full max-w-6xl text-center">
				<div className="rounded-2xl border border-fd-border bg-fd-card p-8">
					<h3 className="text-xl font-semibold text-fd-foreground">
						Bereit, loszulegen?
					</h3>
					<p className="mx-auto mt-2 max-w-2xl text-sm text-fd-muted-foreground">
						Starte mit der Einrichtung deiner Organization, verifiziere eine
						Domain, aktiviere SSO und lege deinen ersten Space an. Die Kopexa
						Docs führen dich Schritt für Schritt.
					</p>
					<div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
						<CTA href="/docs/core" variant="primary">
							Doku starten <ArrowRight className="ml-1.5 h-4 w-4" />
						</CTA>
						<CTA href="/docs/core/organization/domains/setup" variant="ghost">
							Domain & SSO einrichten
						</CTA>
					</div>
				</div>
			</section>
		</main>
	);
}

function CTA({
	href,
	children,
	variant = "primary",
}: {
	href: string;
	children: React.ReactNode;
	variant?: "primary" | "ghost";
}) {
	const base =
		"inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2";
	const styles =
		variant === "primary"
			? "bg-fd-primary text-white hover:opacity-90 focus:ring-fd-primary"
			: "border border-fd-border text-fd-foreground hover:bg-fd-muted focus:ring-fd-border";
	return (
		<Link href={href} className={`${base} ${styles}`}>
			{children}
		</Link>
	);
}

function Badge({ children }: { children: React.ReactNode }) {
	return (
		<span className="rounded-full border border-fd-border bg-fd-muted px-2.5 py-1 text-[11px] leading-none">
			{children}
		</span>
	);
}

function FeatureCard({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="rounded-2xl border border-fd-border bg-fd-card p-6 shadow-sm transition hover:shadow-md">
			<div className="mb-3 inline-flex items-center justify-center rounded-xl bg-fd-muted p-2 text-fd-foreground">
				{icon}
				<span className="sr-only">{title}</span>
			</div>
			<h3 className="text-lg font-semibold text-fd-foreground">{title}</h3>
			<p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">
				{description}
			</p>
		</div>
	);
}

function GuideStep({
	index,
	title,
	to,
}: {
	index: number;
	title: string;
	to: string;
}) {
	return (
		<Link
			href={to}
			className="group flex items-center gap-3 rounded-2xl border border-fd-border bg-fd-card p-4 transition hover:bg-fd-muted"
		>
			<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-fd-muted text-sm font-semibold text-fd-foreground">
				{index}
			</span>
			<span className="text-sm font-medium text-fd-foreground group-hover:underline">
				{title}
			</span>
			<ArrowRight
				className="ml-auto h-4 w-4 text-fd-muted-foreground opacity-70 group-hover:opacity-100"
				aria-hidden
			/>
		</Link>
	);
}

function ModuleCard({
	href,
	icon,
	title,
	description,
}: {
	href: string;
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<Link
			href={href}
			className="flex flex-col rounded-2xl border border-fd-border bg-fd-card p-5 transition hover:bg-fd-muted"
		>
			<div className="mb-3 inline-flex items-center justify-center rounded-xl bg-fd-muted p-2 text-fd-foreground">
				{icon}
				<span className="sr-only">{title}</span>
			</div>
			<h3 className="text-base font-semibold text-fd-foreground">{title}</h3>
			<p className="mt-1 text-sm text-fd-muted-foreground">{description}</p>
		</Link>
	);
}
