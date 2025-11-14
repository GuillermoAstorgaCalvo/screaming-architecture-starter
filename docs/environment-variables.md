# Environment Variables Reference

This guide documents all available environment variables, their defaults, behavior, and usage patterns across different environments.

## Table of Contents

- [Overview](#overview)
- [Build-Time Variables](#build-time-variables)
- [Runtime Configuration](#runtime-configuration)
- [Variable Categories](#variable-categories)
- [Defaults and Behavior](#defaults-and-behavior)
- [Production Configuration](#production-configuration)
- [Docker Configuration](#docker-configuration)
- [Best Practices](#best-practices)

## Overview

This project uses two types of configuration:

1. **Build-Time Variables**: Environment variables prefixed with `VITE_` that are embedded into the application bundle during build
2. **Runtime Configuration**: Values loaded from `public/runtime-config.json` that can be changed without rebuilding

### Why Two Systems?

- **Build-time variables** (`VITE_*`) are baked into the bundle and require a rebuild to change
- **Runtime configuration** (`runtime-config.json`) allows changing configuration values (like API URLs) without rebuilding, which is essential for deployment flexibility

**Rule**: All client-exposed environment variables must be prefixed with `VITE_` to be accessible in the browser.

## Build-Time Variables

Build-time variables are loaded from `.env` files and embedded into the application during the build process. They are validated and typed via `src/core/config/env.client.ts`.

### Development Server Configuration

| Variable    | Type    | Default | Description                                                                                     |
| ----------- | ------- | ------- | ----------------------------------------------------------------------------------------------- |
| `VITE_PORT` | number  | `5173`  | Port for the Vite development server                                                            |
| `VITE_HOST` | string  | `::`    | Host address to bind to (`::` = all interfaces, `0.0.0.0` = IPv4 all, `localhost` = local only) |
| `VITE_OPEN` | boolean | `true`  | Automatically open browser when dev server starts (set to `false` to disable)                   |

**Usage Example:**

```bash
# Use custom port and disable auto-open
VITE_PORT=3000 VITE_OPEN=false pnpm run dev
```

### Build Configuration

| Variable              | Type    | Default                          | Description                                                |
| --------------------- | ------- | -------------------------------- | ---------------------------------------------------------- |
| `VITE_BUILD_TARGET`   | string  | `es2023`                         | JavaScript target for the build (e.g., `es2020`, `es2023`) |
| `VITE_MINIFY`         | string  | `esbuild` (prod) / `false` (dev) | Minification method: `esbuild`, `terser`, or `false`       |
| `VITE_SOURCEMAP`      | string  | `inline` (dev) / `false` (prod)  | Source map generation: `true`, `false`, or `inline`        |
| `VITE_CSS_CODE_SPLIT` | boolean | `true`                           | Enable CSS code splitting (set to `false` to disable)      |

**Usage Example:**

```bash
# Production build with source maps and terser minification
VITE_MINIFY=terser VITE_SOURCEMAP=true pnpm run build
```

### Build Performance & Analysis

| Variable                        | Type    | Default | Description                                                                        |
| ------------------------------- | ------- | ------- | ---------------------------------------------------------------------------------- |
| `VITE_CHUNK_SIZE_WARNING_LIMIT` | number  | `1000`  | Chunk size warning limit in KB (warns if chunk exceeds this size)                  |
| `VITE_REPORT_COMPRESSED_SIZE`   | boolean | `false` | Report compressed (gzipped) bundle sizes (set to `true` to enable)                 |
| `VITE_ANALYZE`                  | boolean | `false` | Generate bundle analysis report (auto-enabled in production unless set to `false`) |
| `VITE_ANALYZE_OPEN`             | boolean | `false` | Automatically open bundle analysis report after build                              |

**Usage Example:**

```bash
# Generate and open bundle analysis
VITE_ANALYZE=true VITE_ANALYZE_OPEN=true pnpm run build
```

The analysis report will be generated at `dist/stats.html` with treemap visualization.

### Application Configuration

| Variable           | Type   | Default | Description                               |
| ------------------ | ------ | ------- | ----------------------------------------- |
| `VITE_APP_NAME`    | string | -       | Application name (example placeholder)    |
| `VITE_APP_VERSION` | string | -       | Application version (example placeholder) |

**Note**: These are example placeholders. Add your own application-specific variables as needed.

### Analytics Configuration

| Variable                 | Type    | Default     | Description                                                         |
| ------------------------ | ------- | ----------- | ------------------------------------------------------------------- |
| `VITE_ANALYTICS_ENABLED` | boolean | `false`     | Enable analytics instrumentation                                    |
| `VITE_GA_MEASUREMENT_ID` | string  | -           | Google Analytics measurement ID (fallback if not in runtime config) |
| `VITE_GA_DEBUG`          | boolean | `false`     | Enable Google Analytics debug mode (overrides DEV mode detection)   |
| `VITE_GA_DATALAYER_NAME` | string  | `dataLayer` | Google Analytics data layer name                                    |

**Usage Example:**

```bash
# Enable analytics with debug mode
VITE_ANALYTICS_ENABLED=true VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX VITE_GA_DEBUG=true pnpm run dev
```

**Note**: For production, prefer setting these in `runtime-config.json` to avoid rebuilds.

### Google Maps Configuration

| Variable                   | Type   | Default | Description                                             |
| -------------------------- | ------ | ------- | ------------------------------------------------------- |
| `VITE_GOOGLE_MAPS_API_KEY` | string | -       | Google Maps API key (fallback if not in runtime config) |

**Usage Example:**

```bash
VITE_GOOGLE_MAPS_API_KEY=your-api-key-here pnpm run dev
```

**Note**: For production, prefer setting this in `runtime-config.json` to avoid exposing the key in the build.

### E2E Testing Configuration

| Variable       | Type    | Default       | Description                                                                                   |
| -------------- | ------- | ------------- | --------------------------------------------------------------------------------------------- |
| `E2E_BASE_URL` | string  | Auto-detected | Base URL for Playwright E2E tests (overrides auto-detection from `VITE_PORT` and `VITE_HOST`) |
| `CI`           | boolean | `false`       | CI environment flag (affects Playwright server reuse behavior)                                |

**Usage Example:**

```bash
# Run E2E tests against custom URL
E2E_BASE_URL=http://localhost:3000 pnpm run test:e2e
```

**Note**: `E2E_BASE_URL` does not require the `VITE_` prefix as it's only used by Playwright (Node.js), not the browser.

## Runtime Configuration

Runtime configuration is loaded from `public/runtime-config.json` at application startup. This allows changing configuration values without rebuilding the application.

### Runtime Config File

Location: `public/runtime-config.json`

**Important**: This file is served as a static asset and is publicly accessible. Do not include sensitive secrets.

### Available Runtime Variables

| Variable              | Type         | Description                                                  |
| --------------------- | ------------ | ------------------------------------------------------------ |
| `API_BASE_URL`        | string (URL) | Base URL for all HTTP requests (validated as proper URL)     |
| `ANALYTICS_WRITE_KEY` | string       | Analytics write key for tracking                             |
| `GOOGLE_MAPS_API_KEY` | string       | Google Maps API key (overrides build-time value)             |
| `FEATURE_FLAGS`       | object       | Feature flag overrides (see [Feature Flags](#feature-flags)) |

### Runtime Config Format

```json
{
	"API_BASE_URL": "https://api.example.com",
	"ANALYTICS_WRITE_KEY": "your-key-here",
	"GOOGLE_MAPS_API_KEY": "your-maps-key",
	"FEATURE_FLAGS": {
		"NEW_CHECKOUT_FLOW": true
	}
}
```

To leave values unset, use `null`:

```json
{
	"API_BASE_URL": null,
	"ANALYTICS_WRITE_KEY": null
}
```

### Feature Flags

Feature flags can be overridden at runtime using either boolean values or full feature flag objects:

**Simple boolean override:**

```json
{
	"FEATURE_FLAGS": {
		"NEW_CHECKOUT_FLOW": true
	}
}
```

**Full feature flag object:**

```json
{
	"FEATURE_FLAGS": {
		"NEW_CHECKOUT_FLOW": {
			"key": "NEW_CHECKOUT_FLOW",
			"enabled": true,
			"description": "Enable new checkout experience"
		}
	}
}
```

Runtime config overrides take precedence over feature flag defaults defined in `src/core/config/featureFlags.ts`.

### Accessing Runtime Config

```typescript
import { getRuntimeConfig, getAppConfig } from '@core/config/runtime';

// Get runtime config only
const config = await getRuntimeConfig();
console.log(config.API_BASE_URL);

// Get merged config (env + runtime)
const appConfig = await getAppConfig();
console.log(appConfig.runtime.API_BASE_URL);
```

## Variable Categories

### Vite Built-in Variables

These are automatically set by Vite and available via `import.meta.env`:

| Variable | Type    | Description                                          |
| -------- | ------- | ---------------------------------------------------- |
| `DEV`    | boolean | `true` in dev server, `false` in production builds   |
| `PROD`   | boolean | `true` in production builds, `false` in dev server   |
| `MODE`   | string  | Current mode: `development`, `production`, or `test` |

**Access Pattern:**

```typescript
import { env } from '@core/config/env.client';

if (env.DEV) {
	console.log('Running in development');
}
```

### Client-Safe Variables

All client-exposed variables are validated and typed via `src/core/config/env.client.ts`:

```typescript
import { env } from '@core/config/env.client';

// Type-safe access
if (env.ANALYTICS_ENABLED) {
	// Analytics is enabled
}
```

**Important**: Never access `import.meta.env` directly. Always use the validated `env` object from `@core/config/env.client`.

## Defaults and Behavior

### Default Values

All environment variables have sensible defaults that ensure the application works out of the box:

- **Server**: Port `5173`, host `::` (all interfaces), auto-open enabled
- **Build**: ES2023 target, esbuild minification, no source maps in production
- **Analytics**: Disabled by default
- **Maps**: No API key required (optional feature)

### Validation and Type Safety

Environment variables are validated using Zod schemas in `src/core/config/env.client.ts`:

- Invalid values fall back to defaults
- Type coercion handles string-to-boolean conversions (`"true"` → `true`)
- Empty strings are treated as undefined/optional
- Validation errors are logged as warnings, not fatal errors

### Precedence Order

1. **Runtime config** (`runtime-config.json`) - Highest priority
2. **Build-time env** (`.env` files) - Medium priority
3. **Code defaults** - Lowest priority

Example: If `GOOGLE_MAPS_API_KEY` is set in both `.env` and `runtime-config.json`, the runtime config value takes precedence.

## Production Configuration

### Build-Time Variables for Production

For production builds, set variables in your CI/CD environment or `.env.production`:

```bash
# .env.production
VITE_ANALYTICS_ENABLED=true
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_BUILD_TARGET=es2023
VITE_MINIFY=esbuild
VITE_SOURCEMAP=false
```

**Note**: Vite automatically loads `.env.production` when building in production mode.

### Runtime Configuration for Production

For production deployments, configure `public/runtime-config.json`:

```json
{
	"API_BASE_URL": "https://api.production.com",
	"ANALYTICS_WRITE_KEY": "prod-key-here",
	"GOOGLE_MAPS_API_KEY": "prod-maps-key",
	"FEATURE_FLAGS": {
		"NEW_CHECKOUT_FLOW": true
	}
}
```

**Deployment Strategy:**

1. Build the application once with build-time variables
2. Deploy the built application to your hosting environment
3. Update `public/runtime-config.json` per environment (staging, production) without rebuilding
4. Use environment-specific runtime config files or deployment scripts to inject values

### Environment-Specific Files

Vite supports environment-specific `.env` files:

- `.env` - Default (loaded in all environments)
- `.env.local` - Local overrides (ignored by git)
- `.env.development` - Development mode only
- `.env.production` - Production mode only
- `.env.[mode].local` - Mode-specific local overrides

**Precedence** (highest to lowest):

1. `.env.[mode].local`
2. `.env.local`
3. `.env.[mode]`
4. `.env`

## Docker Configuration

### Development Docker

The `docker-compose.yml` file sets default environment variables:

```yaml
environment:
  - NODE_ENV=development
  - VITE_PORT=5173
  - VITE_HOST=0.0.0.0
  - VITE_OPEN=${VITE_OPEN:-true}
```

**Usage:**

```bash
# Override variables via .env file or command line
VITE_PORT=3000 docker-compose up
```

### Production Docker

The `docker-compose.prod.yml` file sets production defaults:

```yaml
environment:
  - NODE_ENV=production
```

**Build Arguments:**

Docker build arguments (not environment variables) for image metadata:

| Argument       | Description         | Example                |
| -------------- | ------------------- | ---------------------- |
| `BUILD_DATE`   | Build timestamp     | `2024-01-01T00:00:00Z` |
| `VCS_REF`      | Git commit hash     | `abc123`               |
| `VERSION`      | Application version | `1.0.0`                |
| `NODE_VERSION` | Node.js version     | `22.21.1`              |
| `PNPM_VERSION` | pnpm version        | `10.22.0+sha512...`    |

**Usage:**

```bash
docker build \
  --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
  --build-arg VCS_REF=$(git rev-parse HEAD) \
  --build-arg VERSION=1.0.0 \
  -f Dockerfile.prod \
  -t myapp:prod .
```

## Best Practices

### Security

1. **Never commit secrets**: Add `.env.local` to `.gitignore` (already configured)
2. **Use runtime config for sensitive values**: Prefer `runtime-config.json` for API keys that need to change without rebuilds
3. **Validate all inputs**: All variables are validated via Zod schemas
4. **Use environment-specific files**: Separate `.env.production` from `.env.development`

### Performance

1. **Minimize build-time variables**: Only use `VITE_*` variables that truly need to be in the bundle
2. **Prefer runtime config**: Use `runtime-config.json` for values that change between environments
3. **Cache runtime config**: The runtime config loader caches results after first load

### Development

1. **Use `.env.local`**: Keep local overrides in `.env.local` (git-ignored)
2. **Document custom variables**: Add new variables to `.env.example` with descriptions
3. **Type safety**: Always access variables through `@core/config/env.client` for type safety

### Production

1. **Build once, deploy many**: Build the application once, then use runtime config for environment-specific values
2. **Version control runtime config**: Consider using deployment scripts to inject runtime config per environment
3. **Monitor bundle size**: Use `VITE_ANALYZE=true` to track bundle size changes
4. **Source maps**: Disable source maps in production (`VITE_SOURCEMAP=false`) unless needed for debugging

### Testing

1. **E2E base URL**: Use `E2E_BASE_URL` to test against different environments
2. **CI environment**: Set `CI=true` for Playwright to always start a fresh server
3. **Test-specific configs**: Use `.env.test` for test-specific overrides

## Troubleshooting

### Variables Not Available in Browser

**Problem**: Variable is not accessible in the browser code.

**Solution**: Ensure the variable is prefixed with `VITE_` and accessed through `@core/config/env.client`:

```typescript
// ❌ Wrong
const apiKey = import.meta.env.MY_API_KEY;

// ✅ Correct
import { env } from '@core/config/env.client';
const apiKey = env.GOOGLE_MAPS_API_KEY;
```

### Runtime Config Not Loading

**Problem**: Runtime config values are not being applied.

**Solution**:

1. Check that `public/runtime-config.json` exists and is valid JSON
2. Verify the file is being served correctly (check Network tab)
3. Ensure the app calls `initConfig()` on startup (already configured in `main.tsx`)

### Type Errors

**Problem**: TypeScript errors when accessing environment variables.

**Solution**: Always import from `@core/config/env.client` for type-safe access:

```typescript
import { env } from '@core/config/env.client';
// env is fully typed
```

## Related Documentation

- [Configuration Module README](../src/core/config/README.md) - Detailed config module usage
- [Config Files Reference](./config-files.md) - Overview of all configuration files
- [Docker Setup](./docker-setup.md) - Docker environment configuration
- [Docker Best Practices](./docker-best-practices.md) - Docker deployment guidelines
