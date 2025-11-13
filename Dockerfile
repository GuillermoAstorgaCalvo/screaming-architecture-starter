# Development Dockerfile for Screaming Architecture Starter
# Provides a consistent Linux environment for development and testing
#
# Best Practices:
# - Multi-stage build for smaller images (if needed for production)
# - Non-root user for security
# - Optimized layer caching
# - Minimal base image (Alpine)
# - Proper signal handling

# Build arguments for metadata and versioning
ARG BUILD_DATE
ARG VCS_REF
ARG VERSION=dev
ARG NODE_VERSION=22.21.1
ARG PNPM_VERSION=10.22.0

FROM node:${NODE_VERSION}-alpine AS base

# Redeclare build args for use in this stage
ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

# Add image labels for maintainability and security scanning
LABEL org.opencontainers.image.title="Screaming Architecture Starter" \
      org.opencontainers.image.description="Development container for Screaming Architecture Starter" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.created="${BUILD_DATE}" \
      org.opencontainers.image.revision="${VCS_REF}" \
      org.opencontainers.image.vendor="BrightHub S.L." \
      org.opencontainers.image.authors="guillermo@brighthub.es,masaj@brighthub.es" \
      org.opencontainers.image.url="https://brighthub.es" \
      org.opencontainers.image.documentation="https://github.com/brighthub/screaming-architecture-starter" \
      org.opencontainers.image.licenses="MIT" \
      maintainer="BrightHub S.L. <guillermo@brighthub.es>"

# Install pnpm and system dependencies
# Note: Playwright will install its own browsers with --with-deps flag
ARG PNPM_VERSION
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate && \
    apk add --no-cache \
        bash \
        curl \
        dumb-init \
        git \
    && rm -rf /var/cache/apk/*

# Create non-root user for security and set working directory
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Copy package files first for better layer caching
COPY --chown=nodejs:nodejs package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies as root (needed for system packages)
# Use BuildKit cache mount for pnpm store (faster rebuilds)
# Use BuildKit cache mount for Playwright browsers (faster rebuilds)
# Then change ownership back to nodejs user
# Note: Installing as root is necessary for Playwright's --with-deps flag
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    --mount=type=cache,id=playwright-browsers,target=/root/.cache/ms-playwright \
    pnpm install --frozen-lockfile && \
    (pnpm exec playwright install --with-deps || true) && \
    chown -R nodejs:nodejs /app && \
    rm -rf /tmp/* /var/tmp/*

# Copy project files with proper ownership
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose Vite dev server port
EXPOSE 5173

# Use dumb-init for proper signal handling (SIGTERM, SIGINT, etc.)
# This ensures graceful shutdown of the dev server
ENTRYPOINT ["dumb-init", "--"]

# Default command (can be overridden)
CMD ["pnpm", "run", "dev"]
