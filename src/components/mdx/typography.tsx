// src/components/mdx/typography.tsx
// Custom typography components inspired by Mistral docs
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Heading variants with responsive sizing
const headingSizes = {
  h1: "text-3xl md:text-4xl lg:text-[2.5rem] font-bold tracking-tight",
  h2: "text-2xl md:text-3xl lg:text-[2rem] font-semibold tracking-tight",
  h3: "text-xl md:text-2xl lg:text-[1.5rem] font-semibold",
  h4: "text-lg md:text-xl font-semibold",
  h5: "text-base md:text-lg font-medium",
  h6: "text-sm md:text-base font-medium",
} as const;

type HeadingLevel = keyof typeof headingSizes;

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
}

function createHeading(level: HeadingLevel) {
  const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
    ({ className, children, ...props }, ref) => {
      const Tag = level;
      return (
        <Tag
          ref={ref}
          className={cn(
            headingSizes[level],
            "text-foreground scroll-m-20",
            level === "h1" && "mb-4",
            level === "h2" && "mt-10 mb-4 border-b border-border/40 pb-2",
            level === "h3" && "mt-8 mb-3",
            level === "h4" && "mt-6 mb-2",
            (level === "h5" || level === "h6") && "mt-4 mb-2",
            className
          )}
          {...props}
        >
          {children}
        </Tag>
      );
    }
  );
  Heading.displayName = `Heading${level.toUpperCase()}`;
  return Heading;
}

export const H1 = createHeading("h1");
export const H2 = createHeading("h2");
export const H3 = createHeading("h3");
export const H4 = createHeading("h4");
export const H5 = createHeading("h5");
export const H6 = createHeading("h6");

// Paragraph with improved readability
export const P = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-[0.9375rem] leading-7 text-muted-foreground",
      "[&:not(:first-child)]:mt-4",
      className
    )}
    {...props}
  />
));
P.displayName = "P";

// Strong text
export const Strong = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <strong
    ref={ref}
    className={cn("font-semibold text-foreground", className)}
    {...props}
  />
));
Strong.displayName = "Strong";

// Emphasis/italic text
export const Em = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <em ref={ref} className={cn("italic", className)} {...props} />
));
Em.displayName = "Em";

// Custom bullet component
function Bullet({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block w-1.5 h-1.5 rounded-full bg-primary/60",
        className
      )}
      aria-hidden="true"
    />
  );
}

// Unordered list
export const UL = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "my-4 ml-2 space-y-2 text-[0.9375rem] leading-7 text-muted-foreground",
      className
    )}
    {...props}
  />
));
UL.displayName = "UL";

// Ordered list
export const OL = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "my-4 ml-2 space-y-2 text-[0.9375rem] leading-7 text-muted-foreground list-decimal list-inside",
      className
    )}
    {...props}
  />
));
OL.displayName = "OL";

// List item with custom bullet for unordered lists
export const LI = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, children, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("relative pl-5 list-none", className)}
    {...props}
  >
    <Bullet className="absolute left-0 top-[0.6875rem]" />
    {children}
  </li>
));
LI.displayName = "LI";

// Anchor/Link component
interface AnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
}

export const A = React.forwardRef<HTMLAnchorElement, AnchorProps>(
  ({ className, href, children, ...props }, ref) => {
    if (!href) {
      return (
        <span
          className={cn(
            "text-primary hover:text-primary/80 transition-colors",
            className
          )}
          {...props}
        >
          {children}
        </span>
      );
    }

    const isExternal = href.startsWith("http") || href.startsWith("//");

    if (isExternal) {
      return (
        <a
          ref={ref}
          href={href}
          className={cn(
            "text-primary hover:text-primary/80 underline underline-offset-4 decoration-primary/30 hover:decoration-primary/60 transition-colors",
            className
          )}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={cn(
          "text-primary hover:text-primary/80 underline underline-offset-4 decoration-primary/30 hover:decoration-primary/60 transition-colors",
          className
        )}
        {...props}
      >
        {children}
      </Link>
    );
  }
);
A.displayName = "A";

// Blockquote
export const Blockquote = React.forwardRef<
  HTMLQuoteElement,
  React.HTMLAttributes<HTMLQuoteElement>
>(({ className, ...props }, ref) => (
  <blockquote
    ref={ref}
    className={cn(
      "my-6 border-l-4 border-primary/30 pl-4 py-1 text-muted-foreground italic",
      "[&>p]:mt-0",
      className
    )}
    {...props}
  />
));
Blockquote.displayName = "Blockquote";

// Horizontal rule
export const HR = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cn("my-8 border-t border-border/60", className)}
    {...props}
  />
));
HR.displayName = "HR";

// Inline code (not code blocks)
export const InlineCode = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <code
    ref={ref}
    className={cn(
      "relative rounded bg-muted px-[0.4rem] py-[0.2rem] font-mono text-[0.8125em] font-medium text-foreground",
      "ring-1 ring-border/50",
      className
    )}
    {...props}
  />
));
InlineCode.displayName = "InlineCode";

// Table components
export const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="my-6 w-full overflow-x-auto">
    <table
      ref={ref}
      className={cn("w-full border-collapse text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

export const THead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("border-b border-border bg-muted/50", className)}
    {...props}
  />
));
THead.displayName = "THead";

export const TBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&>tr:last-child]:border-0", className)} {...props} />
));
TBody.displayName = "TBody";

export const TR = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn("border-b border-border/50 transition-colors hover:bg-muted/30", className)}
    {...props}
  />
));
TR.displayName = "TR";

export const TH = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-4 text-left align-middle font-semibold text-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TH.displayName = "TH";

export const TD = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TD.displayName = "TD";
