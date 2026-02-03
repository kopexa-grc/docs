"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const colorConfig = {
  blue: {
    bg: "bg-blue-50/50 dark:bg-blue-950/30",
    hoverBg: "hover:bg-blue-100/80 dark:hover:bg-blue-900/40",
    border: "border-blue-200/60 dark:border-blue-800/40",
    hoverBorder: "hover:border-blue-300 dark:hover:border-blue-700",
    dot: "bg-blue-500",
  },
  orange: {
    bg: "bg-orange-50/50 dark:bg-orange-950/30",
    hoverBg: "hover:bg-orange-100/80 dark:hover:bg-orange-900/40",
    border: "border-orange-200/60 dark:border-orange-800/40",
    hoverBorder: "hover:border-orange-300 dark:hover:border-orange-700",
    dot: "bg-orange-500",
  },
  green: {
    bg: "bg-emerald-50/50 dark:bg-emerald-950/30",
    hoverBg: "hover:bg-emerald-100/80 dark:hover:bg-emerald-900/40",
    border: "border-emerald-200/60 dark:border-emerald-800/40",
    hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-700",
    dot: "bg-emerald-500",
  },
  purple: {
    bg: "bg-violet-50/50 dark:bg-violet-950/30",
    hoverBg: "hover:bg-violet-100/80 dark:hover:bg-violet-900/40",
    border: "border-violet-200/60 dark:border-violet-800/40",
    hoverBorder: "hover:border-violet-300 dark:hover:border-violet-700",
    dot: "bg-violet-500",
  },
  pink: {
    bg: "bg-pink-50/50 dark:bg-pink-950/30",
    hoverBg: "hover:bg-pink-100/80 dark:hover:bg-pink-900/40",
    border: "border-pink-200/60 dark:border-pink-800/40",
    hoverBorder: "hover:border-pink-300 dark:hover:border-pink-700",
    dot: "bg-pink-500",
  },
  yellow: {
    bg: "bg-amber-50/50 dark:bg-amber-950/30",
    hoverBg: "hover:bg-amber-100/80 dark:hover:bg-amber-900/40",
    border: "border-amber-200/60 dark:border-amber-800/40",
    hoverBorder: "hover:border-amber-300 dark:hover:border-amber-700",
    dot: "bg-amber-500",
  },
} as const;

type ColorVariant = keyof typeof colorConfig;

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon?: ReactNode;
  color?: ColorVariant;
}

export function FeatureCard({
  title,
  description,
  href,
  icon,
  color = "blue",
}: FeatureCardProps) {
  const colors = colorConfig[color];

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-start gap-4 rounded-xl p-5",
        "border transition-all duration-200 ease-out",
        "no-underline",
        colors.bg,
        colors.border,
        colors.hoverBg,
        colors.hoverBorder
      )}
    >
      <div className={cn(
        "mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full",
        colors.dot
      )} />
      <div className="min-w-0">
        <div className="font-semibold text-foreground no-underline">
          {title}
        </div>
        <div className="mt-1 text-sm text-muted-foreground leading-relaxed">
          {description}
        </div>
      </div>
    </Link>
  );
}

interface FeatureCardsProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
}

export function FeatureCards({ children, columns = 2 }: FeatureCardsProps) {
  return (
    <div
      className={cn(
        "grid gap-4 my-6 not-prose",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      )}
    >
      {children}
    </div>
  );
}
