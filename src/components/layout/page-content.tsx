import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

interface PageContentProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "main";
  isRoot?: boolean;
}

/**
 * PageContent - Mistral-style inset pane wrapper
 * Creates the white/light background content area with rounded corners and border
 */
export function PageContent({
  children,
  className,
  as: Component = "div",
  isRoot = false,
}: PageContentProps) {
  return (
    <Component
      className={cn(
        "relative overflow-clip bg-fd-background rounded-lg border border-fd-border/50 flex flex-col items-center flex-1 min-w-0",
        isRoot ? "lg:contents border-b-0" : "max-lg:contents",
        className
      )}
    >
      {children}
    </Component>
  );
}
