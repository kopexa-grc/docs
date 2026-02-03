// src/components/footer/index.tsx
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import { FooterColumn } from "./footer-column";
import { FOOTER_LINKS, SOCIALS, KOPEXA_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Logo */}
        <div className="mb-10">
          <Link
            href={KOPEXA_URL}
            className="inline-flex items-center gap-2 text-foreground"
          >
            <div className="grid size-8 place-content-center rounded-md bg-primary">
              <span className="text-sm font-bold text-primary-foreground">K</span>
            </div>
            <span className="text-lg font-semibold">Kopexa</span>
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <FooterColumn title="Plattform" links={FOOTER_LINKS.platform} />
          <FooterColumn title="Katalog" links={FOOTER_LINKS.catalog} />
          <FooterColumn title="Ressourcen" links={FOOTER_LINKS.resources} />
          <FooterColumn title="Unternehmen" links={FOOTER_LINKS.company} />
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Kopexa GmbH. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={SOCIALS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="size-5" />
            </Link>
            <Link
              href={SOCIALS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="LinkedIn"
            >
              <Linkedin className="size-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
