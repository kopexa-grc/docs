import { ArrowRight, Layers, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
	return (
		<main className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center px-6 py-16 bg-gradient-to-b from-fd-background to-fd-muted">
			{/* Hero */}
			<section className="w-full max-w-6xl text-center">
				<p className="mx-auto inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-3 py-1 text-xs font-medium text-fd-muted-foreground">
					<ShieldCheck className="h-3.5 w-3.5" aria-hidden />
					Kopexa Dokumentation – sicher, zugänglich, auditbereit
				</p>

				<h1 className="mx-auto mt-5 max-w-3xl text-pretty text-4xl font-extrabold tracking-tight text-fd-foreground md:text-6xl">
					Kopexa Docs
				</h1>

				<p className="mx-auto mt-4 max-w-3xl text-balance text-lg text-fd-muted-foreground md:text-xl">
					Die zentrale Anlaufstelle f\u00fcr Teams aus IT,
					Informationssicherheit und Datenschutz. Erfahre, wie Kopexa aufgebaut
					ist, starte mit Quickstarts und vertiefe Module im Detail.
				</p>

				{/* Primary CTAs */}
				<div className="mx-auto mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
					<CTA href="/platform" variant="primary">
						Doku starten <ArrowRight className="ml-1.5 h-4 w-4" />
					</CTA>
					<CTA href="/platform/quickstart/organization" variant="ghost">
						Erste Schritte: Organization
					</CTA>
					<CTA
						href="/platform/quickstart/organization/domains/setup"
						variant="ghost"
					>
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
						icon={<Layers className="h-6 w-6" aria-hidden />}
						title="Schnell produktiv"
						description="Geführte Setups, Screenshots, Checklisten – so bist du in Minuten startklar."
					/>
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
