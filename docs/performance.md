# Performance Guide

This guide covers performance optimization strategies, code splitting, bundle size management, lazy loading patterns, and Web Vitals monitoring for the Screaming Architecture starter.

## Table of Contents

- [Optimization Strategies](#optimization-strategies)
- [Code Splitting](#code-splitting)
- [Bundle Size Management](#bundle-size-management)
- [Lazy Loading Patterns](#lazy-loading-patterns)
- [Web Vitals Monitoring](#web-vitals-monitoring)

## Optimization Strategies

### Build Optimizations

The project uses Vite with optimized build configuration:

- **Tree Shaking**: Automatic removal of unused code
- **Minification**: ESBuild-based minification in production
- **Code Splitting**: Automatic route-based splitting with manual chunk configuration
- **CSS Code Splitting**: Separate CSS chunks for better caching
- **Source Maps**: Configurable source maps (disabled in production by default)

### Runtime Optimizations

#### React Optimizations

- **React.lazy()**: Lazy load route components
- **Suspense Boundaries**: Proper loading states for async components
- **Memoization**: Use `React.memo()` for expensive components
- **useMemo/useCallback**: Memoize expensive computations and callbacks

#### Image Optimization

- Use modern formats (WebP/AVIF) when possible
- Implement responsive images with `srcset` and `sizes`
- Lazy load below-the-fold images
- Prefetch critical images

```tsx
// Example: Optimized image component
import { Image } from '@core/ui/media/image';

<Image
	src="/hero-image.webp"
	srcSet="/hero-image-small.webp 480w, /hero-image-large.webp 1200w"
	sizes="(max-width: 768px) 100vw, 50vw"
	loading="lazy"
	alt="Hero image"
/>;
```

#### Font Optimization

- Use `font-display: swap` for web fonts
- Subset fonts to include only needed characters
- Prefer system fonts when acceptable
- Host fonts locally or use trusted CDNs with SRI

#### CSS Optimization

- Tailwind utilities only (no custom CSS unless necessary)
- Purge unused classes via Tailwind config
- Avoid large global CSS files
- Use component-level utility composition

### Dependency Management

- **Avoid Heavy Libraries**: Prefer lightweight, tree-shakeable dependencies
- **Review Bundle Impact**: Check bundle size before adding new dependencies
- **Use Native APIs**: Prefer native browser APIs when possible
- **Tree-Shakeable Imports**: Import only what you need

```tsx
// ❌ Bad: Imports entire library
import _ from 'lodash';

// ✅ Good: Imports only needed function
import debounce from 'lodash/debounce';

// ✅ Better: Use built-in utilities
import { debounce } from '@core/utils/debounce';
```

## Code Splitting

### Route-Based Code Splitting

Routes are automatically code-split using React.lazy():

```tsx
// src/app/router.tsx
import { lazy, Suspense } from 'react';

const LandingPageBase = lazy(() => import('@domains/landing/pages/LandingPage'));

export default function Router() {
	return (
		<Suspense fallback={<DefaultLoadingFallback />}>
			<Routes>
				<Route path="/" element={<LandingPage />} />
			</Routes>
		</Suspense>
	);
}
```

### Manual Chunk Configuration

Vite is configured with manual chunks for better caching:

```typescript
// vite.config.ts
function getCoreLibrariesChunks() {
	return {
		vendor: ['react', 'react-dom', 'react-router-dom'],
		ui: ['@radix-ui/react-slot'],
		query: ['@tanstack/react-query'],
		motion: ['framer-motion'],
		charts: ['recharts'],
		editor: ['@tiptap/react', '@tiptap/starter-kit'],
		forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
		i18n: ['i18next', 'react-i18next'],
	};
}
```

This ensures:

- Vendor libraries are cached separately
- Large libraries (motion, charts, editor) are split into separate chunks
- Only loaded when needed

### Component-Level Code Splitting

For heavy components that aren't route-level, use dynamic imports:

```tsx
// Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
	const [showChart, setShowChart] = useState(false);

	return (
		<div>
			<button onClick={() => setShowChart(true)}>Show Chart</button>
			{showChart && (
				<Suspense fallback={<Spinner />}>
					<HeavyChart />
				</Suspense>
			)}
		</div>
	);
}
```

### Third-Party Library Splitting

Split large third-party libraries that aren't always needed:

```tsx
// Lazy load Google Maps only when needed
const loadGoogleMaps = async () => {
	const { googleMapsAdapter } = await import('@infrastructure/maps/googleMapsAdapter');
	return googleMapsAdapter;
};

// Use in component
useEffect(() => {
	if (needsMap) {
		loadGoogleMaps().then(adapter => {
			// Initialize map
		});
	}
}, [needsMap]);
```

## Bundle Size Management

### Performance Budgets

The project enforces performance budgets:

- **Main bundle (initial route)**: ≤ 200KB gzipped (small sites) / ≤ 350KB (larger apps)
- **CSS bundle**: ≤ 100KB gzipped
- **Total assets**: ≤ 1000KB gzipped
- **LCP**: < 2.5s (mid-tier devices) on Fast 3G
- **CLS**: < 0.1
- **INP**: < 200ms

### Bundle Size Checking

Use the built-in bundle size checker:

```bash
# Build and check bundle sizes
pnpm run build
node scripts/check-bundle-size.js

# Custom thresholds
node scripts/check-bundle-size.js --max-main-kb=250 --max-css-kb=120
```

### Bundle Analysis

Analyze bundle composition with Vite's visualizer:

```bash
# Generate bundle analysis report
VITE_ANALYZE=true pnpm run build

# Open report automatically
VITE_ANALYZE=true VITE_ANALYZE_OPEN=true pnpm run build
```

The report is generated at `dist/stats.html` and shows:

- Bundle composition
- Gzip and Brotli sizes
- Chunk dependencies
- Tree map visualization

### CI/CD Integration

Add bundle size checks to your CI pipeline:

```yaml
# .github/workflows/bundle-size.yml
name: Bundle Size Check
on: [push, pull_request]

jobs:
  check-bundle-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build
      - run: node scripts/check-bundle-size.js
```

### Reducing Bundle Size

#### 1. Remove Unused Dependencies

```bash
# Find unused dependencies
pnpm dlx depcheck

# Remove unused packages
pnpm remove <package-name>
```

#### 2. Replace Heavy Libraries

- Replace `moment.js` with `date-fns` or native `Intl.DateTimeFormat`
- Replace `lodash` with native utilities or `@core/utils`
- Use lightweight alternatives for heavy UI libraries

#### 3. Optimize Imports

```tsx
// ❌ Bad: Imports entire library
import * as Icons from 'lucide-react';

// ✅ Good: Tree-shakeable imports
import { SearchIcon, SettingsIcon } from 'lucide-react';

// ✅ Better: Use project's icon system
import { SearchIcon, SettingsIcon } from '@core/ui/icons';
```

#### 4. Use Dynamic Imports for Optional Features

```tsx
// Only load when feature is enabled
const loadRichEditor = () => import('@core/ui/forms/rich-text-editor');

if (featureFlags.richEditor) {
	const { RichTextEditor } = await loadRichEditor();
	// Use editor
}
```

#### 5. Optimize Third-Party Scripts

- Load analytics scripts asynchronously
- Use `defer` or `async` attributes
- Consider loading non-critical scripts after page load

## Lazy Loading Patterns

### Route Lazy Loading

Routes are lazy-loaded by default:

```tsx
// src/app/router.tsx
import { lazy } from 'react';

const LandingPage = lazy(() => import('@domains/landing/pages/LandingPage'));
const DashboardPage = lazy(() => import('@domains/dashboard/pages/DashboardPage'));
```

### Component Lazy Loading

Lazy load heavy components that aren't immediately visible:

```tsx
import { lazy, Suspense, useState } from 'react';
import { Spinner } from '@core/ui/feedback/spinner';

const HeavyModal = lazy(() => import('./HeavyModal'));

function MyComponent() {
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<button onClick={() => setShowModal(true)}>Open Modal</button>
			{showModal && (
				<Suspense fallback={<Spinner />}>
					<HeavyModal onClose={() => setShowModal(false)} />
				</Suspense>
			)}
		</>
	);
}
```

### Conditional Lazy Loading

Load components based on user interaction or feature flags:

```tsx
import { lazy, Suspense, useState } from 'react';
import { useFeatureFlags } from '@core/config/features';

const AdvancedEditor = lazy(() => import('./AdvancedEditor'));

function Editor() {
	const { isFeatureEnabled } = useFeatureFlags();
	const [useAdvanced, setUseAdvanced] = useState(false);
	const showAdvanced = isFeatureEnabled('advancedEditor') && useAdvanced;

	return (
		<div>
			{showAdvanced ? (
				<Suspense fallback={<Spinner />}>
					<AdvancedEditor />
				</Suspense>
			) : (
				<BasicEditor />
			)}
		</div>
	);
}
```

### Intersection Observer Lazy Loading

Lazy load components when they enter the viewport:

```tsx
import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

function ScrollableList() {
	const [shouldLoad, setShouldLoad] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!ref.current) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setShouldLoad(true);
					observer.disconnect();
				}
			},
			{ rootMargin: '100px' } // Start loading 100px before visible
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<div ref={ref}>
			{shouldLoad ? (
				<Suspense fallback={<Spinner />}>
					<LazyComponent />
				</Suspense>
			) : (
				<div style={{ height: '200px' }}>Placeholder</div>
			)}
		</div>
	);
}
```

### Library Lazy Loading

Lazy load heavy third-party libraries:

```tsx
// Lazy load Google Maps
async function loadGoogleMaps() {
	const { googleMapsAdapter } = await import('@infrastructure/maps/googleMapsAdapter');
	return googleMapsAdapter;
}

// Lazy load chart library
async function loadCharts() {
	const { AreaChart, BarChart } = await import('@core/ui/data-display/chart');
	return { AreaChart, BarChart };
}
```

### Image Lazy Loading

Use native lazy loading for images:

```tsx
<img src="/image.jpg" loading="lazy" alt="Description" />
```

Or use the project's Image component:

```tsx
import { Image } from '@core/ui/media/image';

<Image src="/image.jpg" loading="lazy" alt="Description" />;
```

### Preloading Critical Resources

Preload critical resources that will be needed soon:

```tsx
// In your page component or router
useEffect(() => {
	// Preload next likely route
	const link = document.createElement('link');
	link.rel = 'prefetch';
	link.href = '/dashboard';
	document.head.appendChild(link);
}, []);
```

## Web Vitals Monitoring

### Overview

The project includes built-in Web Vitals monitoring via `core/perf/reportWebVitals.ts`. It tracks:

- **LCP (Largest Contentful Paint)**: Loading performance
- **INP (Interaction to Next Paint)**: Interactivity (replaces FID)
- **CLS (Cumulative Layout Shift)**: Visual stability
- **FCP (First Contentful Paint)**: Initial rendering
- **TTFB (Time to First Byte)**: Server response time

### Setup

Web Vitals tracking is automatically initialized in `main.tsx`:

```typescript
// src/app/main.tsx
import { reportWebVitals } from '@core/perf/reportWebVitals';
import { useLogger } from '@core/providers/logger/useLogger';

// During app bootstrap
const logger = useLogger();
reportWebVitals(logger);
```

### Metrics Thresholds

Google's recommended thresholds:

| Metric | Good    | Needs Improvement | Poor    |
| ------ | ------- | ----------------- | ------- |
| LCP    | ≤ 2.5s  | 2.5s - 4.0s       | > 4.0s  |
| INP    | ≤ 200ms | 200ms - 500ms     | > 500ms |
| CLS    | ≤ 0.1   | 0.1 - 0.25        | > 0.25  |
| FCP    | ≤ 1.8s  | 1.8s - 3.0s       | > 3.0s  |
| TTFB   | ≤ 800ms | 800ms - 1.8s      | > 1.8s  |

### Extending to Analytics Services

To send metrics to analytics services, extend the logger adapter:

```typescript
// infrastructure/observability/webVitalsAdapter.ts
import type { LoggerPort } from '@core/ports/LoggerPort';
import type { AnalyticsPort } from '@core/ports/AnalyticsPort';

export function createWebVitalsAnalyticsAdapter(
	logger: LoggerPort,
	analytics: AnalyticsPort
): LoggerPort {
	return {
		...logger,
		info: (message: string, data?: unknown) => {
			logger.info(message, data);

			// Send to analytics if it's a Web Vital
			if (message.startsWith('Web Vital:')) {
				const metric = data as { metric: string; value: number; rating: string };
				analytics.trackEvent({
					name: 'web_vital',
					properties: {
						metric_name: metric.metric,
						metric_value: metric.value,
						metric_rating: metric.rating,
					},
				});
			}
		},
	};
}
```

### Custom Metric Tracking

Track custom performance metrics:

```typescript
import { onCLS, onINP, onLCP } from 'web-vitals';

// Track custom metric
function trackCustomMetric(name: string, value: number) {
	const logger = useLogger();
	logger.info(`Custom Metric: ${name}`, {
		metric: name,
		value,
		timestamp: Date.now(),
	});
}

// Measure component render time
function useRenderTime(componentName: string) {
	useEffect(() => {
		const start = performance.now();
		return () => {
			const duration = performance.now() - start;
			trackCustomMetric(`${componentName}_render_time`, duration);
		};
	});
}
```

### Lighthouse CI Integration

Set up Lighthouse CI for automated performance testing:

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on:
  schedule:
    - cron: '0 3 * * 1-5' # Run weekdays at 3 AM
  workflow_dispatch:

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build
      - run: pnpm run preview &
      - uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: ./.lighthouserc.json
          uploadArtifacts: true
```

Create `.lighthouserc.json`:

```json
{
	"ci": {
		"collect": {
			"url": ["http://localhost:4173"],
			"numberOfRuns": 3
		},
		"assert": {
			"assertions": {
				"categories:performance": ["error", { "minScore": 0.9 }],
				"categories:accessibility": ["error", { "minScore": 0.9 }],
				"first-contentful-paint": ["error", { "maxNumericValue": 1800 }],
				"largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
				"cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
				"interactive": ["error", { "maxNumericValue": 200 }]
			}
		}
	}
}
```

### Performance Monitoring Best Practices

1. **Monitor in Production Only**: Web Vitals tracking only runs in production
2. **Set Up Alerts**: Configure alerts for metric regressions
3. **Track Trends**: Monitor metrics over time to identify regressions
4. **Segment by Route**: Track metrics per route to identify problem pages
5. **Monitor Real User Metrics (RUM)**: Combine with analytics for real-world data

## Additional Resources

- [Web Vitals Documentation](https://web.dev/vitals/)
- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Bundle Analysis Tools](https://github.com/webpack-contrib/webpack-bundle-analyzer)
