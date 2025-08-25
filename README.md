# Kopexa Docs

The Kopexa documentation site built with Next.js (App Router), Fumadocs, TypeScript, and Tailwind CSS.

- Website: http://kopexa.com
- Documentation: https://docs.kopexa.com

## Quick start

Development server:

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 to view the site.

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

## CI/CD

- Releases are prepared via Release Please (semantic versioning).
- PR validation runs lint and build checks.
- Optional Docker image build/push to GHCR can be enabled in CI.

## Contributing

We welcome fixes and improvements to keep docs accurate and helpful. For larger changes, please open an issue or draft PR first.

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
