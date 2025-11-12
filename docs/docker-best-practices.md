# Docker Best Practices Checklist

This document outlines the Docker best practices implemented in this project.

## ✅ Security Best Practices

### 1. Non-Root User

- **Implementation**: Both Dockerfiles create and run as the `nodejs` user (UID 1001)
- **Benefit**: Reduces attack surface if container is compromised

### 2. Minimal Base Image

- **Implementation**: Uses `node:22.21.1-alpine`
- **Benefit**: Smaller attack surface, faster builds, smaller images

### 3. Read-Only Filesystem (Production)

- **Implementation**: `docker-compose.prod.yml` uses `read_only: true`
- **Benefit**: Prevents malicious writes to filesystem

### 4. Signal Handling

- **Implementation**: Uses `dumb-init` as entrypoint
- **Benefit**: Proper handling of SIGTERM/SIGINT for graceful shutdown

### 5. No Secrets in Images

- **Implementation**: Environment variables passed at runtime
- **Benefit**: Secrets never baked into image layers

### 6. Image Labels and Metadata

- **Implementation**: OCI-compliant labels for maintainability and security scanning in each Dockerfile stage
- **Benefit**: Enables vulnerability scanning, image tracking, and compliance

### 7. Security Hardening (Production)

- **Implementation**: Read-only filesystem, dropped capabilities, no-new-privileges in `docker-compose.prod.yml`
- **Benefit**: Defense in depth, prevents privilege escalation attacks

### 8. CA Certificates

- **Implementation**: Updated CA certificates in production image
- **Location**: `Dockerfile.prod` lines 81-83
- **Benefit**: Ensures secure HTTPS connections

## ✅ Performance Best Practices

### 1. Layer Caching Optimization

- **Implementation**: Package manifests copied before source code in each Dockerfile stage
- **Benefit**: Dependencies layer cached separately from code changes

### 2. Multi-Stage Builds (Production)

- **Implementation**: `Dockerfile.prod` with 3 stages (deps, builder, runner)
- **Benefit**: Smaller final image, only production artifacts included
- **Optimization**: Vite installed in deps stage as production dependency (needed for preview server)

### 3. Volume Optimization

- **Implementation**: Compose file mounts source while keeping `node_modules`, `dist`, `coverage`, `.vitest`, Playwright artifacts isolated inside the container
- **Benefit**: Faster file sync, uses container's node_modules

### 4. .dockerignore

- **Implementation**: Comprehensive `.dockerignore` file that excludes unnecessary files but keeps build configs
- **Location**: `.dockerignore`
- **Benefit**: Smaller build context, faster builds, ensures build configs (tsconfig, vite.config, etc.) are included
- **Coverage**: Excludes Docker files, CI/CD configs, IDE files, caches, test outputs, and build artifacts

### 5. BuildKit Cache Mounts

- **Implementation**: BuildKit cache mounts for pnpm store and Playwright browsers in Docker build stages
- **Benefit**: Faster rebuilds by caching dependencies and browser binaries between builds

### 6. Build Artifact Cleanup

- **Implementation**: Build stages remove temporary caches before producing final image layers
- **Benefit**: Smaller final image size by removing unnecessary build artifacts

## ✅ Reliability Best Practices

### 1. Health Checks

- **Implementation**: Dev and prod compose files define HTTP health checks for port 5173
- **Benefit**: Automatic container health monitoring

### 2. Resource Limits

- **Implementation**: Compose files include CPU and memory reservations/limits for dev and prod services
- **Benefit**: Prevents resource exhaustion

### 3. Restart Policies

- **Implementation**: `restart: unless-stopped` (dev), `restart: always` (prod)
- **Benefit**: Automatic recovery from crashes

### 4. Graceful Shutdown

- **Implementation**: `dumb-init` entrypoints plus `stop_grace_period` in compose files ensure graceful shutdowns
- **Benefit**: Clean shutdown of processes with sufficient time for cleanup

## ✅ Maintainability Best Practices

### 1. Clear Documentation

- **Implementation**: `docs/docker-setup.md` with comprehensive guide
- **Benefit**: Easy onboarding for new developers

### 2. Separate Dev/Prod Configs

- **Implementation**: Separate Dockerfiles and compose files
- **Benefit**: Optimized for each environment

### 3. Version Pinning

- **Implementation**: Specific Node.js and pnpm versions via build arguments
- **Location**: `Dockerfile` lines 15-16, `Dockerfile.prod` lines 12-13
- **Benefit**: Reproducible builds, easy version updates

### 4. Build Arguments

- **Implementation**: Build args for versioning, metadata, and flexibility in all Dockerfiles
- **Benefit**: Version tracking, build metadata, flexible configuration

### 5. Comments in Dockerfiles

- **Implementation**: Inline comments explaining decisions
- **Benefit**: Easier maintenance and understanding

### 6. Proper File Ownership

- **Implementation**: Files copied with `--chown` flags and ownership adjusted before switching to the non-root user
- **Benefit**: Prevents permission issues, follows security best practices

## ✅ Operational Best Practices

### 1. Environment Variable Management

- **Implementation**: `.env` file support with defaults
- **Location**: `docker-compose.yml` lines 17-31
- **Benefit**: Easy configuration without code changes

### 2. Build Args

- **Implementation**: Build arguments for versioning, metadata, and configuration
- **Location**: `docker-compose.yml` lines 8-15, `docker-compose.prod.yml` lines 11-18
- **Benefit**: Version tracking, build metadata, flexible configuration
- **Usage**: Set via environment variables: `BUILD_DATE=2024-01-01T00:00:00Z VCS_REF=abc123 docker-compose build`

### 3. Image Tagging

- **Implementation**: Explicit image names in compose files
- **Benefit**: Clear image management

### 4. Container Naming

- **Implementation**: Explicit container names
- **Benefit**: Easier container management

### 5. Network Configuration

- **Implementation**: Dev and prod compose files create an isolated bridge network for the app service
- **Benefit**: Isolated network for containers, easier service discovery and communication

### 6. Logging Configuration

- **Implementation**: JSON file logging with rotation (and compression in production) in compose definitions
- **Benefit**: Prevents disk space exhaustion, easier log management, compressed logs in production

## Checklist Summary

- [x] Non-root user
- [x] Minimal base image (Alpine)
- [x] Layer caching optimization
- [x] Multi-stage builds (production)
- [x] Health checks
- [x] Resource limits
- [x] Signal handling (dumb-init)
- [x] Read-only filesystem (production)
- [x] Comprehensive .dockerignore (with proper build config inclusion)
- [x] Separate dev/prod configs
- [x] Environment variable management
- [x] Graceful shutdown
- [x] Restart policies
- [x] Documentation
- [x] Version pinning via build args
- [x] Image labels and metadata (OCI-compliant)
- [x] Build arguments for versioning
- [x] Proper file ownership (--chown)
- [x] Security hardening (capabilities, no-new-privileges)
- [x] CA certificates updated
- [x] Network configuration
- [x] Logging configuration with rotation
- [x] Graceful shutdown period (stop_grace_period)
- [x] BuildKit cache mounts for dependencies and browsers
- [x] Optimized production dependency installation
- [x] Build artifact cleanup to reduce image size
- [x] Temporary file cleanup in all stages
- [x] Improved healthcheck documentation

## Additional Recommendations

### For Production Deployments

1. **Use orchestration**: Consider Kubernetes or Docker Swarm for production
2. **Image scanning**: Use tools like Trivy or Snyk to scan images for vulnerabilities:

   ```bash
   # Example with Trivy
   trivy image screaming-architecture-starter:prod

   # Example with Snyk
   snyk test --docker screaming-architecture-starter:prod
   ```

3. **Secrets management**: Use Docker secrets or external secret managers (HashiCorp Vault, AWS Secrets Manager, etc.)
4. **Monitoring**: Integrate with monitoring solutions (Prometheus, Grafana, etc.)
5. **Logging**: Configure centralized logging (ELK, Loki, etc.)
6. **Multi-platform builds**: Use Docker Buildx for ARM/AMD64 support:
   ```bash
   docker buildx build --platform linux/amd64,linux/arm64 -f Dockerfile.prod -t screaming-architecture-starter:prod .
   ```

### For CI/CD

1. **Cache layers**: Use Docker layer caching in CI (GitHub Actions, GitLab CI, etc.)
2. **Multi-platform builds**: Use buildx for ARM/AMD64 support
3. **Image registry**: Push to container registry (Docker Hub, GHCR, etc.)
4. **Tagging strategy**: Use semantic versioning for tags
5. **Build args**: Set BUILD_DATE and VCS_REF in CI for traceability:
   ```bash
   docker build \
     --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
     --build-arg VCS_REF=$(git rev-parse --short HEAD) \
     --build-arg VERSION=$(git describe --tags --always) \
     -f Dockerfile.prod \
     -t screaming-architecture-starter:prod .
   ```
6. **Security scanning**: Integrate image scanning in CI pipeline:
   ```bash
   # Example CI step
   - name: Scan image
     run: |
       trivy image --exit-code 1 --severity HIGH,CRITICAL screaming-architecture-starter:prod
   ```
7. **BuildKit**: Enable BuildKit for faster builds and better caching:
   ```bash
   export DOCKER_BUILDKIT=1
   docker build ...
   ```

## References

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [OWASP Docker Security](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
- [Alpine Linux Security](https://alpinelinux.org/about/)
