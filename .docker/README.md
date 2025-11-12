# Docker Configuration

This directory contains Docker-related documentation and best practices for the project.

## Files Overview

- **Dockerfile**: Development Dockerfile with all dependencies
- **Dockerfile.prod**: Production multi-stage Dockerfile (optimized)
- **docker-compose.yml**: Development docker-compose configuration
- **docker-compose.prod.yml**: Production docker-compose configuration
- **.dockerignore**: Files excluded from Docker build context

## Best Practices Implemented

### Security

- ✅ Non-root user (`nodejs` with UID 1001)
- ✅ Minimal base image (Alpine Linux)
- ✅ Read-only filesystem in production
- ✅ No sensitive data in images
- ✅ Proper signal handling with `dumb-init`

### Performance

- ✅ Optimized layer caching (package files before source)
- ✅ Multi-stage builds for production
- ✅ Volume mounts exclude `node_modules`
- ✅ Resource limits to prevent exhaustion

### Performance

- ✅ Layer caching optimization
- ✅ Multi-stage builds (production)
- ✅ Minimal dependencies
- ✅ Efficient volume mounts

### Reliability

- ✅ Health checks
- ✅ Graceful shutdown handling
- ✅ Restart policies
- ✅ Resource limits

## Development vs Production

### Development (`Dockerfile`)

- Includes all dependencies (dev + prod)
- Includes Playwright browsers
- Hot reload support via volume mounts
- Larger image size (acceptable for dev)

### Production (`Dockerfile.prod`)

- Multi-stage build
- Only production dependencies
- Pre-built static files
- Smaller image size
- Read-only filesystem
- Health checks

## Usage

See `docs/docker-setup.md` for detailed usage instructions.
