// src/components/footer/footer-column.tsx
import Link from "next/link";
import type { FooterLink } from "@/lib/constants";

type FooterColumnProps = {
  title: string;
  links: readonly FooterLink[];
};

export function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-800 dark:text-primary-200">
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-primary-700/80 dark:text-primary-300/80 transition-colors duration-200 hover:text-primary-900 dark:hover:text-primary-100"
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
              {link.external && (
                <span className="ml-1 text-xs opacity-60">↗</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
