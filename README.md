# Kopexa Docs

![PR Checks](https://github.com/kopexa-grc/docs/actions/workflows/pr.yml/badge.svg)
![Release](https://github.com/kopexa-grc/docs/actions/workflows/release.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
[![Docker](https://img.shields.io/badge/docker-ghcr.io%2Fkopexa--grc%2Fdocs-blue)](https://github.com/orgs/kopexa-grc/packages?repo_name=docs)

Public documentation for Kopexa’s ISMS/GRC platform (ISO 27001, GDPR, DORA, NIS2, …). It includes end‑user guides and developer docs. Built with Next.js App Router, Fumadocs, TypeScript, and Tailwind CSS.

- Website: http://kopexa.com
- Documentation: https://docs.kopexa.com

## Quick start

Development server:

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 to view the site.

## Configuration

- Environment variables (common):
	- `NODE_ENV` — production/development
	- `NEXT_TELEMETRY_DISABLED` — set to `1` to disable Next telemetry
	- `PORT` — defaults to `3000` (container)
	- `HOSTNAME` — defaults to `0.0.0.0` (container)
	- Optional: `NEXT_PUBLIC_SITE_URL` for absolute links if needed
- i18n: see `src/lib/i18n.ts` to add or adjust supported languages.
- Content source and schemas: `source.config.ts` (Fumadocs MDX collections and frontmatter/meta schemas).

## Project structure

- `src/app/(home)`: Landing and marketing pages
- `src/app/[lang]/docs`: Documentation routes (Fumadocs)
- `content/`: MD/MDX content for the docs
- `src/components/`: UI components for the docs site
- `src/lib/`: Shared utilities (i18n, layout, sources)

Key files:

- `source.config.ts`: Fumadocs source + schema
- `src/lib/layout.shared.tsx`: Shared layout options (links, nav)
- `src/app/api/search/route.ts`: Search API
- `src/app/api/healthz/route.ts`: Liveness probe (Kubernetes)
- `src/app/api/readyz/route.ts`: Readiness probe (Kubernetes)

## Docker

This repo includes a production-ready Dockerfile using Next.js standalone output.

Build locally:

```bash
docker build -t ghcr.io/<owner>/<repo>:dev .
```

Run the container:

```bash
docker run --rm -p 3000:3000 ghcr.io/<owner>/<repo>:dev
```

The container listens on port 3000 and binds to 0.0.0.0. Entry command runs `node server.js` produced by Next.js standalone build.

## Deployment

- Docker standalone image, default `EXPOSE 3000`, listens on `0.0.0.0`.
- Health endpoints for Kubernetes probes:
	- Liveness: `GET /api/healthz`
	- Readiness: `GET /api/readyz`
- Suitable for GitOps/ArgoCD style deployments.

## CI/CD

- PR checks: `.github/workflows/pr.yml` (lint + build via reusable workflows)
- Release & Docker image: `.github/workflows/release.yml` (builds and publishes to GHCR, then triggers `release-cd.yml`)
- Reusable workflows: `.github/workflows/lint.yml`, `.github/workflows/build.yml`
- Security scan (optional): `.github/workflows/docker-security-scan.yml`
- Versioning: SemVer via GitHub Releases/Tags.

## Contributing

We welcome fixes and improvements to keep docs accurate and helpful. For larger changes, please open an issue or draft PR first.

- Branch naming: `feat/...`, `fix/...`, `chore/...`, `docs/...`
- Commits: Conventional Commits (e.g., `docs: update spaces guide`)
- Lint/Format: `pnpm lint` and `pnpm format` (Biome)
- Local tasks: see `Taskfile.dist.yml` (`task dev`, `task lint`, `task docker:build IMAGE_TAG=...`)

## Credits (FOSS)

Kopexa Docs are powered by:

- Next.js (App Router) — https://nextjs.org/
- Fumadocs — https://fumadocs.dev/
- React — https://react.dev/
- TypeScript — https://www.typescriptlang.org/
- Tailwind CSS — https://tailwindcss.com/
- Lucide Icons — https://lucide.dev/

Thanks to the FOSS community for making this stack possible.

## License

- Code (application, components, config): [MIT License](./LICENSE)
- Content under `./content/`: Proprietary — see [content/LICENSE](./content/LICENSE)

## Roadmap (short)

- More multi-language content
- Additional framework guides (TISAX, ISO 27017, …)
- Search improvements and content structure refinements
