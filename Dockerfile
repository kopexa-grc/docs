ARG NODE=node:23-alpine3.22

FROM ${NODE} AS base


# Enable corepack and prepare pnpm
RUN npm install --ignore-scripts -g corepack@latest 
RUN corepack enable
RUN corepack prepare pnpm@9.15.9 --activate

# Install necessary build tools and compilers
RUN apk update && apk add --no-cache cmake g++ gcc jq make openssl-dev python3

# Increase Node.js memory limit as a regular build argument
ARG NODE_OPTIONS="--max_old_space_size=4096"
ENV NODE_OPTIONS=${NODE_OPTIONS}

# Set the working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# Install the dependencies
RUN pnpm install --ignore-scripts

# Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the database package first
RUN pnpm build 

#
## setup production runner
#
FROM ${NODE} AS runner

RUN npm install --ignore-scripts -g corepack@latest 
RUN corepack enable

RUN apk add --no-cache curl \
    && apk add --no-cache supercronic \
    # && addgroup --system --gid 1001 nodejs \
    && addgroup -S nextjs \
    && adduser -S -u 1001 -G nextjs nextjs

WORKDIR /home/nextjs

ENV NODE_ENV production

# Ensure no write permissions are assigned to the copied resources
COPY --from=builder /app/.next/standalone ./
RUN chown -R nextjs:nextjs ./ && chmod -R 755 ./

COPY --from=builder /app/next.config.mjs .
RUN chmod 644 ./next.config.mjs

COPY --from=builder /app/package.json .
RUN chmod 644 ./package.json

COPY --from=builder /app/.next/static ./.next/static
RUN chown -R nextjs:nextjs ./.next/static && chmod -R 755 ./.next/static

COPY --from=builder /app/public ./public
RUN chown -R nextjs:nextjs ./public && chmod -R 755 ./public

EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
USER nextjs

ENV PORT 3000

CMD ["node", "server.js"]