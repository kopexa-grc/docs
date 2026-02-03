# Kopexa Docs Redesign - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign Kopexa Docs with Mistral-inspired layout, new footer based on kopexa.com, and remove landing page in favor of direct docs access.

**Architecture:** Replace the home page with a redirect to docs. Create a new comprehensive footer component matching kopexa.com structure. Apply Mistral-style CSS for animations and glassmorphism. Keep Fumadocs as the core framework.

**Tech Stack:** Next.js 16, Fumadocs, React 19, Tailwind CSS v4, TypeScript

---

## Task 1: Create Constants File

**Files:**
- Create: `src/lib/constants.ts`

**Step 1: Create the constants file with all URLs**

```typescript
// src/lib/constants.ts

export const KOPEXA_URL = "https://kopexa.com";
export const KOPEXA_APP_URL = "https://app.kopexa.com";
export const KOPEXA_STATUS_URL = "https://status.kopexa.com";

export const SOCIALS = {
  github: "https://github.com/kopexa-grc",
  linkedin: "https://de.linkedin.com/company/kopexa",
} as const;

export const FOOTER_LINKS = {
  platform: [
    { label: "Asset Management", href: `${KOPEXA_URL}/de/platform/asset-management` },
    { label: "Incident Management", href: `${KOPEXA_URL}/de/platform/incident-management` },
    { label: "Lieferanten Management", href: `${KOPEXA_URL}/de/platform/vendor-management` },
    { label: "Richtlinien", href: `${KOPEXA_URL}/de/platform/policies` },
    { label: "Risk Management", href: `${KOPEXA_URL}/de/platform/risk-management` },
  ],
  catalog: [
    { label: "Übersicht", href: `${KOPEXA_URL}/de/catalog` },
    { label: "ISO 27001", href: `${KOPEXA_URL}/de/catalog/iso-27001` },
    { label: "TISAX", href: `${KOPEXA_URL}/de/catalog/tisax` },
    { label: "DSGVO", href: `${KOPEXA_URL}/de/catalog/gdpr` },
    { label: "NIS2", href: `${KOPEXA_URL}/de/catalog/nis2` },
    { label: "DORA", href: `${KOPEXA_URL}/de/catalog/dora` },
  ],
  resources: [
    { label: "Blog", href: `${KOPEXA_URL}/de/blog` },
    { label: "Dokumentation", href: "/" },
    { label: "Status", href: KOPEXA_STATUS_URL, external: true },
    { label: "Glossar", href: `${KOPEXA_URL}/de/glossary` },
    { label: "Lösungen", href: `${KOPEXA_URL}/de/solutions` },
    { label: "Für Berater", href: `${KOPEXA_URL}/de/partners/consultants` },
  ],
  company: [
    { label: "Impressum", href: `${KOPEXA_URL}/de-de/legal/legal-notice`, external: true },
    { label: "Datenschutz", href: `${KOPEXA_URL}/de-de/legal/privacy-policy`, external: true },
    { label: "Cookies", href: `${KOPEXA_URL}/de-de/legal/cookies`, external: true },
    { label: "Barrierefreiheit", href: `${KOPEXA_URL}/de-de/legal/accessibility`, external: true },
    { label: "Modern Slavery Act", href: `${KOPEXA_URL}/de-de/legal/modern-slavery`, external: true },
    { label: "Security", href: `${KOPEXA_URL}/de/security`, external: true },
    { label: "SLA", href: `${KOPEXA_URL}/de-de/legal/sla`, external: true },
  ],
} as const;

export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};
```

**Step 2: Verify TypeScript compiles**

Run: `cd /Users/juliankoehn/workbox/github.com/kopexa-grc/docs/.worktrees/feature-docs-redesign-2025 && pnpm tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/constants.ts
git commit -m "feat: add constants file with Kopexa URLs and footer links"
```

---

## Task 2: Create Footer Column Component

**Files:**
- Create: `src/components/footer/footer-column.tsx`

**Step 1: Create the footer column component**

```typescript
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
      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
              {link.external && (
                <span className="ml-1 text-xs opacity-50">↗</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `pnpm tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/footer/footer-column.tsx
git commit -m "feat: add FooterColumn component"
```

---

## Task 3: Create Main Footer Component

**Files:**
- Create: `src/components/footer/index.tsx`

**Step 1: Create the main footer component**

```typescript
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
```

**Step 2: Verify TypeScript compiles**

Run: `pnpm tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/footer/index.tsx
git commit -m "feat: add main Footer component with Kopexa links"
```

---

## Task 4: Replace LegalFooter with New Footer in Docs Layout

**Files:**
- Modify: `src/app/[lang]/(docs)/layout.tsx`

**Step 1: Update the docs layout to use the new Footer**

Replace `LegalFooter` import and usage:

```typescript
// src/app/[lang]/(docs)/layout.tsx
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;

  const { nav, ...base } = baseOptions(lang);

  return (
    <DocsLayout
      {...base}
      nav={{
        ...nav,
        title: (
          <>
            <span className="font-medium in-[.uwu]:hidden max-md:hidden">
              Kopexa
            </span>
          </>
        ),
      }}
      tree={source.pageTree[lang]}
    >
      {children}
      <Footer />
    </DocsLayout>
  );
}
```

**Step 2: Verify build succeeds**

Run: `pnpm build 2>&1 | tail -20`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/app/[lang]/(docs)/layout.tsx
git commit -m "feat: replace LegalFooter with new Footer in docs layout"
```

---

## Task 5: Convert Home Page to Redirect

**Files:**
- Modify: `src/app/[lang]/(home)/page.tsx`

**Step 1: Replace home page content with redirect**

```typescript
// src/app/[lang]/(home)/page.tsx
import { redirect } from "next/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  redirect(`/${lang}/platform`);
}
```

**Step 2: Verify build succeeds**

Run: `pnpm build 2>&1 | tail -20`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/app/[lang]/(home)/page.tsx
git commit -m "feat: redirect home page to /platform docs"
```

---

## Task 6: Add Root Redirect in next.config.mjs

**Files:**
- Modify: `next.config.mjs`

**Step 1: Add redirects to config**

```javascript
// next.config.mjs
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: "standalone",
  serverExternalPackages: ["shiki"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/de/platform",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/:lang/:path*.mdx",
        destination: "/:lang/llms.mdx/:path*",
      },
    ];
  },
};

export default withMDX(config);
```

**Step 2: Verify build succeeds**

Run: `pnpm build 2>&1 | tail -20`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add next.config.mjs
git commit -m "feat: add root redirect to /de/platform"
```

---

## Task 7: Update Global CSS with Animations

**Files:**
- Modify: `src/app/global.css`

**Step 1: Add animation and glassmorphism styles**

```css
/* src/app/global.css */
@import 'tailwindcss';
@import 'fumadocs-ui/css/ocean.css';
@import 'fumadocs-ui/css/preset.css';

:root {
  --fd-layout-width: 1400px;
}

#nd-sidebar {
  @apply bg-transparent;
}

/* Navbar glassmorphism */
#nd-nav {
  @apply backdrop-blur-md bg-background/80 border-b border-border/40;
}

/* Sidebar hover animations */
#nd-sidebar [data-active] {
  @apply transition-colors duration-200;
}

#nd-sidebar a:hover {
  @apply bg-muted/50 transition-colors duration-200;
}

/* Footer styling */
footer {
  @apply transition-colors duration-200;
}

footer a {
  @apply transition-colors duration-200;
}

/* Smooth page transitions */
main {
  @apply animate-in fade-in duration-300;
}

@theme {
  --color-primary-50: oklch(96.58% 0.016 262.77);
  --color-primary-100: oklch(92.21% 0.037 262.15);
  --color-primary-200: oklch(84.55% 0.074 259.28);
  --color-primary-300: oklch(76.66% 0.113 255.47);
  --color-primary-400: oklch(68.81% 0.153 250.39);
  --color-primary-500: oklch(61.06% 0.141 250.16);
  --color-primary-600: oklch(53.38% 0.119 250.22);
  --color-primary-700: oklch(45.75% 0.099 250.12);
  --color-primary-800: oklch(37.91% 0.082 250.88);
  --color-primary-900: oklch(30.29% 0.063 250.69);
  --color-primary-950: oklch(26.35% 0.054 251.42);

  /* Animation keyframes */
  --animate-in: enter 0.3s ease-out;

  @keyframes enter {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

**Step 2: Verify build succeeds**

Run: `pnpm build 2>&1 | tail -20`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/app/global.css
git commit -m "feat: add glassmorphism and animation styles"
```

---

## Task 8: Clean Up Unused Files

**Files:**
- Delete: `src/components/LegalFooter.tsx`
- Modify: `src/app/[lang]/(home)/layout.tsx` (remove LegalFooter import)

**Step 1: Update home layout to remove LegalFooter**

```typescript
// src/app/[lang]/(home)/layout.tsx
import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";
import { baseOptions } from "@/lib/layout.shared";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;

  return <HomeLayout {...baseOptions(lang)}>{children}</HomeLayout>;
}
```

**Step 2: Delete LegalFooter.tsx**

Run: `rm src/components/LegalFooter.tsx`

**Step 3: Verify build succeeds**

Run: `pnpm build 2>&1 | tail -20`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove unused LegalFooter component"
```

---

## Task 9: Final Build Verification

**Step 1: Run full build**

Run: `pnpm build`
Expected: Build succeeds with no errors

**Step 2: Run lint**

Run: `pnpm lint`
Expected: No lint errors

**Step 3: Start dev server and verify**

Run: `pnpm dev`
- Visit `http://localhost:3000` → Should redirect to `/de/platform`
- Check footer displays all links
- Check dark/light mode toggle works
- Check mobile responsive behavior

**Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address any final issues from testing"
```

---

## Task 10: Summary Commit and PR Preparation

**Step 1: Review all changes**

Run: `git log --oneline feature/docs-redesign-2025 ^main`

**Step 2: Verify branch is ready**

Run: `git status`
Expected: Clean working tree

**Step 3: Push branch**

```bash
git push -u origin feature/docs-redesign-2025
```

---

## Acceptance Checklist

After completing all tasks, verify:

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] `/` redirects to `/de/platform`
- [ ] Footer shows all 4 columns (Plattform, Katalog, Ressourcen, Unternehmen)
- [ ] Footer shows GitHub and LinkedIn icons
- [ ] Dark mode works
- [ ] Light mode works
- [ ] Mobile responsive (footer stacks on small screens)
- [ ] Navbar has glassmorphism effect on scroll
- [ ] Sidebar hover states have smooth transitions
