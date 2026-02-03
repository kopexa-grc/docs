// src/components/footer/index.tsx
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";
import { FooterColumn } from "./footer-column";
import { PixelAnimation } from "./pixel-animation";
import { FOOTER_LINKS, SOCIALS, KOPEXA_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto relative overflow-hidden">
      {/* Soft transition from content area */}
      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-background to-transparent z-10" />

      {/* Gradient Background - Kopexa Blue themed */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50 via-primary-100 to-primary-200 dark:from-primary-950 dark:via-primary-900 dark:to-primary-800" />

      {/* Pixel Art Animation */}
      <PixelAnimation />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-48 lg:px-8">
        {/* Logo */}
        <div className="mb-12 flex justify-center">
          <Link
            href={KOPEXA_URL}
            className="inline-flex items-center gap-3 text-primary-900 dark:text-primary-100 hover:opacity-80 transition-opacity"
          >
            <div className="grid size-10 place-content-center rounded-lg bg-primary-600 shadow-lg shadow-primary-600/25">
              <span className="text-lg font-bold text-white">K</span>
            </div>
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          <FooterColumn title="Plattform" links={FOOTER_LINKS.platform} />
          <FooterColumn title="Katalog" links={FOOTER_LINKS.catalog} />
          <FooterColumn title="Ressourcen" links={FOOTER_LINKS.resources} />
          <FooterColumn title="Unternehmen" links={FOOTER_LINKS.company} />
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-primary-200/50 dark:border-primary-700/50 pt-8 sm:flex-row">
          <p className="text-sm text-primary-700 dark:text-primary-300">
            © {new Date().getFullYear()} Kopexa GmbH. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href={SOCIALS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 transition-colors hover:text-primary-800 dark:hover:text-primary-200"
              aria-label="GitHub"
            >
              <Github className="size-5" />
            </Link>
            <Link
              href={SOCIALS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 transition-colors hover:text-primary-800 dark:hover:text-primary-200"
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
