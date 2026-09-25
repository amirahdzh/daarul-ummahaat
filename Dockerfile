# syntax=docker/dockerfile:1.7

# Production image for the Daarul Ummahaat website (Payload CMS inside Next.js).
# Build:  docker build -t daarul-ummahaat .
# The image holds no secrets. Configuration comes from environment variables at runtime.

ARG NODE_VERSION=24

# ---- Dependencies -------------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS deps
RUN apk add --no-cache libc6-compat
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ---- Build --------------------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS build
RUN apk add --no-cache libc6-compat
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production
RUN corepack enable
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The build does not connect to the database (pages are rendered per request), but the
# configuration expects these variables to exist. The real values are set at runtime.
ENV PAYLOAD_SECRET=build-time-placeholder \
    DATABASE_URL=postgres://build:build@127.0.0.1:5432/build \
    SITE_URL=http://localhost:3000
RUN pnpm build

# ---- Runtime ------------------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS runner
RUN apk add --no-cache libc6-compat
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    MEDIA_DIR=/data/media \
    NODE_OPTIONS=--max-old-space-size=1024
WORKDIR /app

# Uploaded files live on a volume mounted here.
RUN mkdir -p /data/media && chown -R node:node /data

COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000

LABEL org.opencontainers.image.title="Daarul Ummahaat website" \
      org.opencontainers.image.description="Payload CMS in Next.js"

CMD ["node", "server.js"]
