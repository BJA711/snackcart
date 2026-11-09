# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV BUILD_STANDALONE=true

RUN npm run build

# Stage 3: Runner (Optimized for Red Hat OpenShift / Non-Root Arbitrary UIDs)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV HOME=/tmp

# Create unprivileged system user for local container execution
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs -G root

# Copy static assets and standalone server output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# OpenShift Arbitrary-UID Compliance:
# 1. Ensure required runtime cache directories exist
# 2. Assign root group (GID 0) ownership to the application directory
# 3. Grant group-read and group-execute permissions to all application files
# 4. Restrict group-write permissions strictly to runtime cache paths (.next/cache)
RUN mkdir -p /app/.next/cache/images /app/.next/cache/fetch-cache && \
    chgrp -R 0 /app && \
    chmod -R g+rX /app && \
    chmod -R g+rwX /app/.next/cache

# Default unprivileged user; OpenShift will override with arbitrary UID belonging to GID 0
USER 1001

EXPOSE 3000

CMD ["node", "server.js"]
