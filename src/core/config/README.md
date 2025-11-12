# Configuration Module

This module provides centralized configuration management for the application.

## Structure

- **`env.client.ts`**: Build-time environment variables (Vite `import.meta.env`) with Zod validation
- **`routes.ts`**: Global route path constants (`ROUTES`)
- **`runtime.ts`**: Runtime configuration loader from `public/runtime-config.json`
- **`featureFlags.ts`**: Feature flag definitions with metadata and default values
- **`features.ts`**: Runtime feature flag toggles and access functions
- **`seo.ts`**: SEO defaults and helper functions for dynamic metadata management
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

// Feature flags
import { isFeatureEnabled, isFeatureEnabledAsync } from '@core/config/features';

// SEO helpers
import { DEFAULT_SEO, mergeSEOConfig, buildPageTitle } from '@core/config/seo';
import { useSEO } from '@core/hooks/useSEO';

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

### Feature Flags

Feature flags enable gradual rollout, A/B testing, and safe feature toggling without code deployments.

**Define feature flags** in `featureFlags.ts`:

```ts
export const FEATURE_FLAGS = {
	NEW_CHECKOUT_FLOW: {
		key: 'NEW_CHECKOUT_FLOW',
		description: 'Enable new checkout experience',
		enabled: false,
	},
} as const satisfies Record<string, FeatureFlag>;
```

**Check feature flags** in your code:

```ts
import { isFeatureEnabled } from '@core/config/features';

// Synchronous (uses cached runtime config if available)
if (isFeatureEnabled('NEW_CHECKOUT_FLOW')) {
	// Feature is enabled
}

// Async (loads runtime config if needed)
const enabled = await isFeatureEnabledAsync('NEW_CHECKOUT_FLOW');
```

**Override at runtime** via `runtime-config.json`:

```json
{
	"FEATURE_FLAGS": {
		"NEW_CHECKOUT_FLOW": true
	}
}
```

Or use full feature flag objects:

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

**Best practices:**

- Default values should be safe (typically `false`)
- Avoid sprinkling flag checks across components; centralize behavior in domain services/hooks
- Keep flags typed and documented
- Runtime config overrides take precedence over definition defaults

### SEO & Metadata

SEO helpers enable per-route metadata updates and improve sharing/discoverability.

**Use the `useSEO` hook** in your page components:

```tsx
import { useSEO } from '@core/hooks/useSEO';

function MyPage() {
	useSEO({
		title: 'My Page',
		description: 'This is my awesome page',
		ogImage: '/my-page-image.png',
		indexable: true,
	});

	return <div>My Page Content</div>;
}
```

**Use helper functions** for building SEO values:

```ts
import { buildPageTitle, mergeSEOConfig, buildAbsoluteUrl } from '@core/config/seo';

// Build a full page title
const title = buildPageTitle('My Page'); // "My Page | Screaming Architecture Starter"

// Merge custom config with defaults
const seo = mergeSEOConfig({
	title: 'My Page',
	description: 'Custom description',
});

// Build absolute URLs for sharing
const ogImageUrl = buildAbsoluteUrl('/og-image.png');
```

**Available options:**

- `title` - Page title (appended to site name)
- `description` - Meta description
- `indexable` - Whether page should be indexed (default: `true`)
- `canonicalUrl` - Canonical URL (auto-detected from current path if not provided)
- `ogType` - Open Graph type (default: `'website'`)
- `ogImage` - Open Graph image URL
- `ogImageWidth`, `ogImageHeight` - Image dimensions
- `ogImageAlt` - Image alt text
- `twitterCard` - Twitter card type (default: `'summary_large_image'`)
- `twitterImage` - Twitter image URL
- `keywords` - Comma-separated keywords
- `author` - Author name
- `customMeta` - Custom meta tags array

**Default values** are defined in `DEFAULT_SEO` and can be imported for reference.

See `.cursor/rules/ux/seo.mdc` for SEO best practices.

## Architecture

See `.cursor/rules/config/config.mdc` for detailed architecture guidelines.
