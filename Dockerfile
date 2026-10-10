# syntax=docker/dockerfile:1
FROM node:24-alpine AS build
WORKDIR /app
RUN apk add --no-cache git && npm install --global pnpm@9.15.9
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=docs-pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts --store-dir /pnpm/store
COPY . .
ARG NODE_OPTIONS="--max-old-space-size=3072"
ARG DEPLOYMENT_ENV=production
ARG NEXT_PUBLIC_DEPLOYMENT_ENV=production
ARG NEXT_PUBLIC_CONFIG_JSON={}
ENV NEXT_TELEMETRY_DISABLED=1 NEXT_OUTPUT=standalone
RUN --mount=type=cache,target=/app/.next/cache,sharing=locked \
    node scripts/container-build.mjs

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/content ./content
USER node
EXPOSE 3000
CMD ["node", "server.js"]
