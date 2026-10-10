# Kopexa Docs

![PR Checks](https://github.com/kopexa-grc/docs/actions/workflows/pr.yml/badge.svg)
![Website delivery](https://github.com/kopexa-grc/docs/actions/workflows/website-delivery.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

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

`docs.kopexa.com` is deployed automatically on every push to `main` by **Coolify** (self-hosted on the Kopexa OVH cluster). Coolify watches this repository, builds the Dockerfile, and rolls the container out. A merge to `main` is sufficient to go live; no GitHub release is required.

The Docker image:

- Standalone Next.js build, `EXPOSE 3000`, listens on `0.0.0.0`
- Health endpoints (used by Coolify):
	- Liveness: `GET /api/healthz`
	- Readiness: `GET /api/readyz`

## CI/CD

GitHub Actions checks pull requests and publishes environment-specific images on main. Staging delivery dispatches the verified image digest to envs. Production cluster delivery remains disabled during migration; the existing Coolify deployment is independent of these checks.

- PR checks: `.github/workflows/pr.yml` runs lint, typecheck and build (`.github/workflows/lint.yml`, `.github/workflows/build.yml`)
- Main delivery: `.github/workflows/website-delivery.yml` runs lint/typecheck, Release Please, one environment-specific image build and container smoke tests. See Website delivery below.

## Contributing

We welcome fixes and improvements to keep docs accurate and helpful. For larger changes, please open an issue or draft PR first.

- Branch naming: `feat/...`, `fix/...`, `chore/...`, `docs/...`
- Commits: Conventional Commits (e.g., `docs: update spaces guide`)
- Lint/Format: `pnpm lint` and `pnpm format` (Biome)
- Typecheck: `pnpm typecheck` (TypeScript)
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


## Kubernetes container preparation

The Dockerfile builds a Next.js standalone image with Node 24 and pnpm 9.15.9.
Standalone output is enabled only by `NEXT_OUTPUT=standalone` in the Docker build.
Normal builds retain the `next build` / `next start` path for Coolify/Nixpacks.
It runs as UID/GID 1000 on port 3000 and exposes `/api/health`. It is compatible
with the shared website workload base in the infrastructure repository. Delivery uses the shared GitHub workflow described below; Argo activation is
managed separately in the infrastructure repository.

For a staging image:

```sh
docker build -t docs:staging \
  --build-arg DEPLOYMENT_ENV=staging \
  --build-arg NEXT_PUBLIC_DEPLOYMENT_ENV=staging \
  --build-arg 'NEXT_PUBLIC_CONFIG_JSON={"NEXT_PUBLIC_BASE_URL":"https://docs-staging.kopexa.com"}' .
docker run --rm -p 3000:3000 docs:staging
```

Staging sends `X-Robots-Tag: noindex, nofollow` on all paths. Public configuration
and this header are baked into the image; runtime environment changes do not
replace a rebuild. Use a separate production build (the default). The JSON build
argument accepts only public `NEXT_PUBLIC_*` string values; never put secrets in it.
The Docker context excludes Git history, so optional Git-derived last-modified
dates are unavailable in this image. The German documentation is served at
`/platform` (`/de/platform` redirects there); English content is not configured.


## Website delivery (GitHub)

`.github/workflows/website-delivery.yml` runs lint/typecheck and the reusable
`kopexa-grc/github-actions` Next.js delivery workflow pinned to `v0.0.4`.
It replaces the former additional Main Checks build. PR lint/typecheck/build
checks remain in place; pull requests do not publish staging deployments.

- Ordinary main pushes build and smoke-test a staging image, then dispatch its
  digest to the `envs` websites receiver when staging `GITOPS_ENABLED=true`.
- Release Please starts from the existing v1.13.4 release. Merging its release PR
  builds the production image for the new tag and skips a duplicate staging build.
- Production `GITOPS_ENABLED=false` keeps cluster promotion disabled during the
  Coolify migration. Production DNS remains unchanged.

GitHub Environments supply `DEPLOYMENT_URL`, `NEXT_PUBLIC_CONFIG_JSON`,
`BUILD_NODE_OPTIONS` and `GITOPS_ENABLED`. Staging uses
`https://docs-staging.kopexa.com`; production uses `https://docs.kopexa.com`.
The existing organization secret `KOPEXA_CLOUD_REPO_ACCESS_TOKEN` is passed only
as the GitOps dispatch token. Release Please uses `RELEASE_PLEASE_TOKEN` when
available, otherwise GITHUB_TOKEN (bot-created PR checks may then need a manual
trigger). No secret values are committed or passed as public build arguments.

The cluster's staging HTTPRoute requires Basic Auth; image smoke tests and Pod
health probes use the internal container endpoint and do not need that login.
Argo onboarding requires a real published digest and a ready website-owned TLS
certificate before ListenerSet/route activation. The envs repository owns that
rollout and its step-by-step runbook.
