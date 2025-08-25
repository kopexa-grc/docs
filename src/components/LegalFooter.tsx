import Link from "next/link";
import { legalLinks } from "@/lib/legal";

type Props = {
	lang?: string;
};

export function LegalFooter(_props: Props) {
	return (
		<footer className="mt-12 border-t py-6 text-sm text-muted-foreground">
			<div className="mx-auto max-w-6xl px-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<p className="m-0">© {new Date().getFullYear()} Kopexa</p>
				<nav className="flex gap-4" aria-label="Legal">
					{legalLinks.map((l) => (
						<Link
							key={l.url}
							href={l.url}
							className="hover:underline"
							{...(l.external
								? { target: "_blank", rel: "noopener noreferrer" }
								: {})}
						>
							{l.text}
						</Link>
					))}
				</nav>
			</div>
		</footer>
	);
}
