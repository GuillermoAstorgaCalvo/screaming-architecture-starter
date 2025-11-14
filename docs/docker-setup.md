# Docker Setup for Development

This project includes Docker configuration to provide a consistent development and testing environment across all platforms, especially useful for Windows users experiencing issues with native Node.js tooling.

## Why Docker?

- **Consistency**: Same Linux environment as CI/CD (runs on `ubuntu-latest`)
- **Windows Compatibility**: Avoids Windows-specific issues with Vitest forks pool, file paths, and process handling
- **Isolation**: Clean environment without affecting your system
- **Reproducibility**: Same results across all team members' machines

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac) or Docker Engine (Linux)
- Docker Compose (included with Docker Desktop)

## Quick Start

### Development Server

```bash
# Build and start the dev server
pnpm run docker:dev

# Or manually:
docker-compose up
```

The dev server will be available at `http://localhost:5173`

### Running Tests

**⚠️ Important**: Running tests with Docker is the recommended approach, especially on Windows, to avoid fork runner timeout issues.

```bash
# Run unit tests
pnpm run docker:test

# Run tests with coverage
pnpm run docker:test -- --coverage

# Run tests in watch mode
pnpm run docker:test:watch

# Run E2E tests
pnpm run docker:test:e2e
```

**Note**: Coverage reports will be generated in the `coverage/` directory and will be accessible from your host machine since it's mounted as a volume.

### Interactive Shell

```bash
# Open a shell inside the container
pnpm run docker:shell

# Then run any command:
pnpm run test
pnpm run lint
pnpm run build
```

## Docker Commands Reference

### Build the image

```bash
pnpm run docker:build
# or
docker-compose build
```

### Start services

```bash
pnpm run docker:dev
# or
docker-compose up
```

### Run one-off commands

```bash
# Run tests
docker-compose run --rm app pnpm run test

# Run tests with coverage
docker-compose run --rm app pnpm run test -- --coverage

# Run linting
docker-compose run --rm app pnpm run lint

# Run typecheck
docker-compose run --rm app pnpm run typecheck

# Run build
docker-compose run --rm app pnpm run build
```

### Stop services

```bash
docker-compose down
```

### View logs

```bash
docker-compose logs -f app
```

## Volume Mounts

The Docker setup uses volume mounts to:

- Sync your local code changes into the container (hot reload works!)
- Exclude `node_modules` for better performance (uses container's node_modules)
- Exclude build outputs (`dist`, `coverage`) to avoid conflicts

## Environment Variables

Environment variables can be set in:

1. `.env` file (loaded automatically)
2. `.env.local` file (loaded automatically, overrides `.env`)
3. `docker-compose.yml` `environment` section
4. Command line: `docker-compose run --rm -e NODE_ENV=test app pnpm run test`

## Troubleshooting

### Port already in use

If port 5173 is already in use, change it in `docker-compose.yml`:

```yaml
ports:
  - '5174:5173' # Use 5174 on host, 5173 in container
```

### Permission issues (Linux)

If you encounter permission issues on Linux:

```bash
# Fix ownership
sudo chown -R $USER:$USER .
```

### Rebuild after dependency changes

```bash
# Rebuild the image
pnpm run docker:build

# Or rebuild and restart
docker-compose up --build
```

### Clear Docker cache

```bash
# Remove containers
docker-compose down

# Remove volumes (including node_modules)
docker-compose down -v

# Remove image
docker rmi screaming-architecture-starter_app
```

## When to Use Docker vs Native

### Use Docker when:

- ✅ You're on Windows and experiencing test runner issues
- ✅ You want to match CI/CD environment exactly
- ✅ You want isolation from your system
- ✅ You're setting up a new machine quickly

### Use Native when:

- ✅ You're on Mac/Linux and everything works fine
- ✅ You need faster iteration (slightly faster than Docker)
- ✅ You're debugging native system issues
- ✅ You prefer direct tooling access

## Production Build

For production deployments, use the production Dockerfile:

```bash
# Build production image
pnpm run docker:prod:build

# Or manually with build args for versioning:
docker build \
  --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
  --build-arg VCS_REF=$(git rev-parse --short HEAD) \
  --build-arg VERSION=$(git describe --tags --always 2>/dev/null || echo 'latest') \
  -f Dockerfile.prod \
  -t screaming-architecture-starter:prod .

# Or use docker-compose with environment variables:
BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
VCS_REF=$(git rev-parse --short HEAD) \
VERSION=$(git describe --tags --always 2>/dev/null || echo 'latest') \
docker-compose -f docker-compose.prod.yml build

# Run production container
pnpm run docker:prod:up

# Or manually:
docker-compose -f docker-compose.prod.yml up
```

The production build:

- Uses multi-stage builds for smaller image size
- Only includes production dependencies (vite included for preview server)
- Serves pre-built static files
- Includes health checks
- Runs as non-root user
- Uses read-only filesystem for security
- Includes OCI-compliant image labels for tracking
- Supports build arguments for versioning and metadata
- Uses BuildKit cache mounts for faster rebuilds
- Configured with network isolation and log rotation

## Security Best Practices

The Docker setup follows security best practices:

1. **Non-root user**: Container runs as `nodejs` user (UID 1001)
2. **Minimal base image**: Uses Alpine Linux for smaller attack surface
3. **Signal handling**: Uses `dumb-init` for proper process signal handling
4. **Read-only filesystem**: Production containers use read-only root filesystem
5. **Resource limits**: CPU and memory limits prevent resource exhaustion
6. **Health checks**: Monitors container health automatically
7. **Security hardening**: Production containers drop unnecessary capabilities and use `no-new-privileges`
8. **CA certificates**: Updated CA certificates for secure HTTPS connections
9. **Image labels**: OCI-compliant labels for security scanning and compliance

## CI/CD Integration

The starter template does not bundle a CI workflow yet (the `.github/workflows/` directory is intentionally absent). When you add CI, prefer running the toolchain natively on Linux runners because:

- The environment matches the Docker containers (Node 22 + pnpm)
- Native execution keeps pipelines faster
- Docker-in-Docker adds overhead unless isolation is required

For local development, Docker provides the same Linux environment, ensuring consistency even before CI is configured.

## Docker Best Practices Applied

This setup follows Docker best practices:

✅ **Layer caching**: Package files copied before source code
✅ **Non-root user**: Runs as `nodejs` user for security
✅ **Minimal image**: Uses Alpine Linux base
✅ **Health checks**: Monitors container health
✅ **Signal handling**: Uses `dumb-init` for graceful shutdown
✅ **Resource limits**: Prevents resource exhaustion
✅ **Multi-stage builds**: Separate production Dockerfile
✅ **.dockerignore**: Excludes unnecessary files (but keeps build configs)
✅ **OCI-compliant labels**: Image metadata for tracking and security scanning
✅ **Build arguments**: Versioning and metadata support
✅ **Proper file ownership**: Files copied with `--chown` flag
✅ **Security hardening**: Capabilities dropped, no-new-privileges in production
✅ **Volume optimization**: Excludes node_modules from mounts
✅ **Network configuration**: Isolated bridge network for containers
✅ **Logging configuration**: Log rotation with compression (production)
✅ **Graceful shutdown**: stop_grace_period configured for clean shutdowns
✅ **BuildKit cache mounts**: Faster rebuilds with dependency and browser caching
