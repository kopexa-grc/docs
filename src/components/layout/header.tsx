"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Globe, Menu } from "lucide-react";
import { cn } from "@/lib/cn";
import { KOPEXA_APP_URL } from "@/lib/constants";

interface HeaderProps {
  lang: string;
  onMenuClick?: () => void;
}

export function Header({ lang, onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-fd-border/40 bg-fd-muted/80 backdrop-blur-md">
      <div className="flex h-14 items-center px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          type="button"
          className="mr-2 lg:hidden p-2 hover:bg-fd-muted rounded-md"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="size-5" />
        </button>

        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2 mr-6">
          <div className="grid size-8 place-content-center rounded-md bg-primary-600">
            <span className="text-sm font-bold text-white">K</span>
          </div>
          <span className="font-semibold text-fd-foreground hidden sm:inline">
            Docs
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link
            href={`/${lang}/platform`}
            className="px-3 py-1.5 text-sm font-medium text-fd-foreground/70 hover:text-fd-foreground rounded-md hover:bg-fd-muted transition-colors"
          >
            Docs
          </Link>
          <Link
            href={`/${lang}/catalogs`}
            className="px-3 py-1.5 text-sm font-medium text-fd-foreground/70 hover:text-fd-foreground rounded-md hover:bg-fd-muted transition-colors"
          >
            Catalogs
          </Link>
          <Link
            href={`/${lang}/integrations`}
            className="px-3 py-1.5 text-sm font-medium text-fd-foreground/70 hover:text-fd-foreground rounded-md hover:bg-fd-muted transition-colors"
          >
            Integrations
          </Link>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 hover:bg-fd-muted rounded-md text-fd-foreground/70 hover:text-fd-foreground transition-colors"
            aria-label="Toggle theme"
          >
            <Sun className="size-5 hidden dark:block" />
            <Moon className="size-5 dark:hidden" />
          </button>

          {/* Language toggle */}
          <Link
            href={lang === "de" ? "/en/platform" : "/de/platform"}
            className="p-2 hover:bg-fd-muted rounded-md text-fd-foreground/70 hover:text-fd-foreground transition-colors"
            aria-label="Switch language"
          >
            <Globe className="size-5" />
          </Link>

          {/* CTA Button */}
          <Link
            href={KOPEXA_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium",
              "bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            )}
          >
            Zur App
            <span className="text-xs">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
