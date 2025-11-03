# Configuration Module

This module provides centralized configuration management for the application.

## Structure

- **`env.client.ts`**: Build-time environment variables (Vite `import.meta.env`) with Zod validation
- **`routes.ts`**: Global route path constants (`ROUTES`)
- **`runtime.ts`**: Runtime configuration loader from `public/runtime-config.json`
- **`init.ts`**: Configuration initialization that sets up global services

## Usage

### Import Pattern

Import directly from the specific config module files (no barrel exports):

```ts
// Environment variables
import { env } from '@core/config/env.client';

// Route constants
import { ROUTES } from '@core/config/routes';

// Runtime configuration
import { getRuntimeConfig, getAppConfig, getCachedRuntimeConfig } from '@core/config/runtime';

// Initialization
import { initConfig } from '@core/config/init';
```

### Environment Variables

Access validated environment variables:

```ts
import { env } from '@core/config/env.client';

if (env.DEV) {
	console.log('Running in development mode');
}
```

**Alternative: Environment Constants**

For convenience, you can also use pre-computed constants from `@core/constants/env.ts`:

```ts
import {
	IS_DEV,
	IS_PROD,
	ENV_MODE,
	isDevelopment,
	isProduction,
	getMode,
} from '@core/constants/env';

if (IS_DEV) {
	console.log('Running in development mode');
}

// Or use helper functions
if (isDevelopment()) {
	console.log('Running in development mode');
}
```

These constants are thin wrappers around the validated env surface and avoid re-parsing env elsewhere. Both patterns are valid - use whichever you prefer.

### Routes

Use route constants instead of hardcoded strings:

```ts
import { ROUTES } from '@core/config/routes';

<Link to={ROUTES.HOME}>Home</Link>
```

### Runtime Configuration

Runtime config is loaded automatically on app startup via `initConfig()` in `main.tsx`.

To access runtime config:

```ts
import { getRuntimeConfig, getAppConfig, getCachedRuntimeConfig } from '@core/config/runtime';

// Async (loads if not cached) - returns runtime config only
const config = await getRuntimeConfig();

// Async (loads if not cached) - returns merged app config (env + runtime)
const appConfig = await getAppConfig();

// Synchronous (returns cached or null)
const cached = getCachedRuntimeConfig();
```

The `httpClient` baseURL is automatically configured from `runtime-config.json` during initialization.

### Runtime Config File Format

The `public/runtime-config.json` file accepts:

- Valid URL strings for `API_BASE_URL`
- String values for `ANALYTICS_WRITE_KEY`
- `null` values (treated as undefined/not set)
- Empty strings `""` (treated as undefined/not set)

Example:

```json
{
	"API_BASE_URL": "https://api.example.com",
	"ANALYTICS_WRITE_KEY": "your-key-here"
}
```

Or to leave values unset:

```json
{
	"API_BASE_URL": null,
	"ANALYTICS_WRITE_KEY": null
}
```

## Architecture

See `.cursor/rules/config/config.mdc` for detailed architecture guidelines.
