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
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Create unprivileged system user with GID 0 compatibility for OpenShift SCC
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /app/.next/cache && \
    chgrp -R 0 /app && \
    chmod -R g=u /app

# Copy static assets and standalone server output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Grant GID 0 group write permissions to satisfy OpenShift arbitrary UID requirements
RUN chgrp -R 0 /app && chmod -R g=u /app

USER 1001

EXPOSE 8080

CMD ["node", "server.js"]
