# Kopexa Docs — Copilot Instructions

These instructions guide GitHub Copilot (and similar tools) when assisting with our **Kopexa documentation site** built with **Fumadocs**, **Next.js (app router)**, **TypeScript**, and **Tailwind CSS**.

> TL;DR for Copilot: Prefer TypeScript, Next.js app router conventions, Fumadocs primitives, and Tailwind utility classes. Generate small, focused diffs with correct paths.

---

## 1) Project Context
- **Stack:** Next.js (app dir), Fumadocs UI, TypeScript (ESM), Tailwind CSS, MDX.
- **Design:** Minimal, accessible, content-first. Use our icon set (**Lucide**), and respect our brand color **#13274E** via Tailwind tokens (no hard-coded hex unless defining design tokens).
- **i18n:** `next-intl` / shared `i18n` helper (see `src/lib/i18n`).

### Folder conventions
- `src/app/(home)` — landing/home layout
- `src/app/docs` — docs routes
- `content` — MD/MDX content
- `src/lib` — shared utilities (e.g., `layout.shared.tsx`)
- `src/components` — presentational React components for docs site

> If you propose new files, include the full relative path from `/docs`.

---

## 2) Coding Guidelines

### General
- Always **TypeScript** with strict types. No `any` unless unavoidable, then narrow quickly.
- Use **ESM** imports; keep imports ordered: built-ins → external → internal aliases.
- Prefer **named exports** over default exports.
- No inline styles; use **Tailwind** classes. Extract reusable variants when classes repeat.
- Accessibility first: semantic HTML, `aria-*`, keyboard focus management, color contrast.

### Next.js (app router)
- Prefer **Server Components** by default. Add `"use client"` **only** when interactivity is needed.
- Use `next/link`, `next/image` (with `alt`), and route handlers in `app` when necessary.
- Do not introduce `pages/` router.
- Avoid blocking data fetches in client components. Docs are mostly static.

### Tailwind CSS
- Utility-first, compose classes; avoid custom CSS unless component-level.
- Use `prose` for article content when appropriate (e.g., MDX rendering), and extend via Tailwind config.
- Don’t hardcode colors; use semantic tokens. Primary brand: `#13274E` (configured in Tailwind theme).

### Fumadocs
- Use Fumadocs navigation APIs and layout props (`BaseLayoutProps`) as in `src/lib/layout.shared.tsx`.
- For nav icons, use **Lucide** (e.g., `<AppWindow />`).
- For links, prefer absolute HTTPS URLs or internal Next.js `href`.

### MDX / Content
- Prefer fenced code blocks with language hints (` ```ts`, ` ```bash`).
- Keep titles in H1 at the top of a page; one H1 per document.
- Use admonitions via supported MDX components (e.g., `Note`, `Tip`) if available in the stack.

---

## 3) What Copilot Should Generate
- **Small, targeted changes** with correct **file paths** and clear **diff-friendly** code blocks.
- Realistic examples that compile.
- For icons, import from `lucide-react` (or our wrapper if present).
- For links to the app, use `https://app.kopexa.com` (see `layout.shared.tsx`).

### Examples

#### Add a secondary navbar link
**File:** `src/lib/layout.shared.tsx`
```tsx
// inside baseOptions()
links: [
  {
    icon: <AppWindow />,
    text: "App",
    url: "https://app.kopexa.com",
    secondary: true,
  },
  {
    icon: <AppWindow />, // replace with a better icon if needed
    text: "Status",
    url: "https://status.kopexa.com",
    secondary: true,
  },
],
```

#### Create a docs component
**File:** `src/components/Callout.tsx`
```tsx
"use client";
import { Info } from "lucide-react";
import type { PropsWithChildren } from "react";

export function Callout({ children }: PropsWithChildren) {
  return (
    <div className="rounded-md border p-4 flex items-start gap-2 bg-white/50">
      <Info aria-hidden className="mt-0.5" />
      <div className="prose dark:prose-invert max-w-none">{children}</div>
    </div>
  );
```

#### MDX usage of the component
**File:** `content/getting-started.mdx`
```mdx
---
title: Getting Started
---

# Getting Started

import { Callout } from "@/components/Callout";

<Callout>
This is a callout used in our docs.
</Callout>
```

---

## 4) Anti‑patterns (Do **not** do this)
- ❌ Add `pages/` router or `_app.tsx`/`_document.tsx`.
- ❌ Use inline styles for layout.
- ❌ Hard-code theme colors instead of tokens.
- ❌ Default exports for components unless required by a framework.
- ❌ Introduce unapproved libraries for UI.
- ❌ Fetch external data on every client render in docs pages.

---

## 5) Commit Messages (Conventional Commits)
- `docs:` for content changes
- `feat(docs):` for new components/functionality in docs
- `fix(docs):` for bug fixes
- `chore(docs):` for tooling/config changes

**Examples**
- `docs: add getting started page`
- `feat(docs): callout component for MDX`
- `fix(docs): correct nav link to app`

---

## 6) Review Checklist (for generated proposals)
- Types compile (`tsc --noEmit`).
- Next.js routes resolve and build succeeds (`next build`).
- No client component unless interactivity.
- Tailwind classes applied; no inline styles.
- Accessibility: images have `alt`, interactive elements have labels.

---

## 7) Prompts Copilot Can Use Internally
- “Propose a minimal diff to add a new docs nav link in `src/lib/layout.shared.tsx`.”
- “Generate a small MDX page under `content/…` with frontmatter and one example code block.”
- “Create a reusable Tailwind-based callout component with Lucide icons.”

---

## 8) Maintenance
- Keep this file up to date when the docs structure, Next.js version, or design tokens change.
- If adding new shared components, document their usage patterns here briefly.
