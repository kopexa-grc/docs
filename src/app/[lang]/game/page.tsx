import type { Metadata } from "next";
import Link from "next/link";
import { ComplianceRunner } from "@/components/compliance-runner";
import { LegalFooter } from "@/components/LegalFooter";
import { createMetadata } from "@/lib/metadata";

export function generateMetadata(): Metadata {
	return createMetadata({
		title: "GRC Invaders - The Compliance Arcade Game",
		description:
			"Defend your organization against Audit Findings, Shadow IT, and Regulatory Fines (GDPR, NIS2, DORA). A retro arcade game by Kopexa.",
		slug: "game",
	});
}

export default async function GamePage({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0a1929] via-[#0F263E] to-[#1a3a5c]">
			{/* Header */}
			<header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
				<div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
					<Link
						href={`/${lang}/platform`}
						className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						<span className="font-mono text-sm">Back to Docs</span>
					</Link>
					<Link
						href="https://kopexa.com"
						target="_blank"
						rel="noopener noreferrer"
						className="text-[#22d3ee] hover:text-[#22d3ee]/80 font-mono text-sm font-bold transition-colors"
					>
						KOPEXA
					</Link>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
				<div className="text-center mb-6">
					<h1 className="text-3xl sm:text-4xl font-bold text-[#22d3ee] font-mono mb-2">
						GRC INVADERS
					</h1>
					<p className="text-white/60 font-mono text-sm max-w-md mx-auto">
						Defend your organization against compliance threats.
						Survive audits, dodge shadow IT, and avoid those regulatory fines!
					</p>
				</div>

				<ComplianceRunner />

				{/* Game Info */}
				<div className="mt-8 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
					<div className="bg-white/5 rounded-lg p-4 border border-white/10">
						<h3 className="text-[#ef4444] font-mono font-bold text-sm mb-1">
							Enemies
						</h3>
						<p className="text-white/50 text-xs font-mono">
							Audit Findings, Shadow IT, GDPR/NIS2/DORA Fines
						</p>
					</div>
					<div className="bg-white/5 rounded-lg p-4 border border-white/10">
						<h3 className="text-[#22c55e] font-mono font-bold text-sm mb-1">
							Power-Ups
						</h3>
						<p className="text-white/50 text-xs font-mono">
							ISO Certification, Kopexa Automation, Consulting Team
						</p>
					</div>
					<div className="bg-white/5 rounded-lg p-4 border border-white/10">
						<h3 className="text-[#ec4899] font-mono font-bold text-sm mb-1">
							Boss
						</h3>
						<p className="text-white/50 text-xs font-mono">
							The Regulator - Every 5 Waves
						</p>
					</div>
				</div>

				{/* CTA */}
				<div className="mt-8 text-center">
					<p className="text-white/40 font-mono text-xs mb-3">
						Tired of fighting compliance manually?
					</p>
					<Link
						href="https://kopexa.com"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 px-6 py-3 bg-[#22d3ee] hover:bg-[#22d3ee]/80 text-[#0a1929] font-mono font-bold text-sm rounded-lg transition-colors"
					>
						Try Kopexa - Automate Your GRC
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M14 5l7 7m0 0l-7 7m7-7H3"
							/>
						</svg>
					</Link>
				</div>
			</main>

			{/* Footer */}
			<footer className="border-t border-white/10 bg-black/20">
				<div className="mx-auto max-w-6xl px-4 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-white/40 font-mono text-xs">
						© {new Date().getFullYear()} Kopexa GmbH - Made with 💜 for the GRC community
					</p>
					<nav className="flex gap-4 text-xs font-mono">
						<Link
							href="https://kopexa.com/legal/imprint"
							target="_blank"
							rel="noopener noreferrer"
							className="text-white/40 hover:text-white/60 transition-colors"
						>
							Imprint
						</Link>
						<Link
							href="https://kopexa.com/legal/privacy"
							target="_blank"
							rel="noopener noreferrer"
							className="text-white/40 hover:text-white/60 transition-colors"
						>
							Privacy
						</Link>
						<Link
							href={`/${lang}/platform`}
							className="text-white/40 hover:text-white/60 transition-colors"
						>
							Documentation
						</Link>
					</nav>
				</div>
			</footer>
		</div>
	);
}
