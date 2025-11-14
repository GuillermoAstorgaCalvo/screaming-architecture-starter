# Creating New Domains

This guide explains how to create and structure new business domains in the Screaming Architecture starter.

## When to Create a Domain

Create a new domain when you have:

- **Distinct business area** with its own pages, services, state, and UI
- **Self-contained functionality** that can operate independently
- **Clear boundaries** from other business areas

If functionality is **reused across multiple domains**, consider placing it in `domains/shared/*` instead.

## Domain Structure

A typical domain has the following structure:

```
src/domains/<domain-name>/
├── pages/              # Route-level page components
├── components/         # Domain-specific UI components (optional)
├── hooks/              # Domain-specific hooks (optional)
├── services/           # API services and business logic
│   └── api/            # API service implementations
├── store/              # Zustand stores for domain state
├── models/             # Zod schemas and type definitions (optional)
├── i18n/               # Domain translations
│   ├── index.ts        # Translation registration
│   ├── en.json         # English translations
│   ├── es.json         # Spanish translations
│   └── ar.json         # Arabic translations
└── constants.ts        # Domain-specific constants (optional)
```

## Step-by-Step Guide

### 1. Create Domain Directory

```bash
mkdir -p src/domains/my-domain/{pages,components,hooks,services/api,store,i18n,models}
```

### 2. Create Domain Page

```tsx
// src/domains/my-domain/pages/MyDomainPage.tsx
import { useTranslation } from '@core/i18n/useTranslation';

export default function MyDomainPage() {
	const { t } = useTranslation('my-domain');

	return (
		<div>
			<h1>{t('title')}</h1>
			<p>{t('description')}</p>
		</div>
	);
}
```

### 3. Add Route to Configuration

```ts
// src/core/config/routes.ts
export const ROUTES = {
	HOME: '/',
	MY_DOMAIN: '/my-domain',
	// ... other routes
} as const;
```

### 4. Register Route in Router

```tsx
// src/app/router.tsx
import AppLayout from '@app/components/AppLayout';
import { withTheme } from '@app/components/PageWrapper';
import Error404 from '@app/pages/Error404';
import type { AnalyticsPageView } from '@core/ports/AnalyticsPort';
import { useAnalytics } from '@core/providers/analytics/useAnalytics';
import { buildRoute } from '@core/router/routes.gen';
import { DefaultLoadingFallback } from '@core/ui/utilities/loadable/components/loadableFallback';
import { RouteTransition } from '@core/ui/utilities/motion/components/RouteTransition';
import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

const MyDomainPageBase = lazy(() => import('@domains/my-domain/pages/MyDomainPage'));
const MyDomainPage = withTheme(MyDomainPageBase);

export default function Router() {
	const analytics = useAnalytics();
	const location = useLocation();

	useEffect(() => {
		const path = `${location.pathname}${location.search}${location.hash}`;

		const pageView: AnalyticsPageView = { path };

		const documentTitle = 'document' in globalThis ? globalThis.document.title : undefined;

		if (documentTitle !== undefined) {
			pageView.title = documentTitle;
		}

		const windowLocation = 'window' in globalThis ? globalThis.window.location.href : undefined;

		if (windowLocation !== undefined) {
			pageView.location = windowLocation;
		}

		analytics.trackPageView(pageView);
	}, [analytics, location.hash, location.pathname, location.search]);

	return (
		<AppLayout>
			<Suspense fallback={<DefaultLoadingFallback />}>
				<RouteTransition locationKey={location.pathname}>
					<Routes location={location}>
						{/* ... other routes */}
						<Route path={buildRoute('MY_DOMAIN')} element={<MyDomainPage />} />
						<Route path="*" element={<Error404 />} />
					</Routes>
				</RouteTransition>
			</Suspense>
		</AppLayout>
	);
}
```

### 5. Create Domain Translations

```json
// src/domains/my-domain/i18n/en.json
{
	"title": "My Domain",
	"description": "Welcome to my domain"
}
```

```json
// src/domains/my-domain/i18n/es.json
{
	"title": "Mi Dominio",
	"description": "Bienvenido a mi dominio"
}
```

```json
// src/domains/my-domain/i18n/ar.json
{
	"title": "مجالتي",
	"description": "مرحباً بك في مجالتي"
}
```

### 6. Register Translations

```ts
// src/domains/my-domain/i18n/index.ts
import { registerDomainTranslations } from '@core/i18n/registry';
import type { SupportedLanguage } from '@core/i18n/constants/constants';

registerDomainTranslations('my-domain', async (language: SupportedLanguage) => {
	switch (language) {
		case 'en': {
			return import('./en.json');
		}
		case 'es': {
			return import('./es.json');
		}
		case 'ar': {
			return import('./ar.json');
		}
		default: {
			return import('./en.json');
		}
	}
});
```

### 7. Import Translation Registration

```ts
// src/app/main.tsx
// ... existing imports
import '@domains/my-domain/i18n';
```

### 8. Add TypeScript Types

```ts
// src/core/i18n/types/types.ts
// ... existing types

export interface MyDomainTranslations {
	title: string;
	description: string;
}

export type TranslationNamespaces = {
	common: CommonTranslations;
	landing: LandingTranslations;
	'my-domain': MyDomainTranslations; // Add here
};
```

### 9. Create Domain Service (Optional)

```ts
// src/domains/my-domain/services/api/getMyDomainDataService.ts
import { createApiService } from '@core/api/createApiService';
import type { ApiService } from '@core/api/createApiService.types';
import type { HttpPort } from '@core/ports/HttpPort';
import { z } from 'zod';

const myDomainDataSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export type MyDomainData = z.infer<typeof myDomainDataSchema>;

export function createGetMyDomainDataService(
	http: HttpPort
): ApiService<{ id: string }, MyDomainData> {
	return createApiService<{ id: string }, MyDomainData>(http, {
		endpoint: request => `/api/my-domain/${request.id}`,
		method: 'GET',
		responseSchema: myDomainDataSchema,
		defaultErrorMessage: 'Failed to load data',
	});
}
```

### 10. Create Domain Store (Optional)

```ts
// src/domains/my-domain/store/myDomainStore.ts
import type { StoreSelector } from '@core/lib/storeUtils';
import { create } from 'zustand';

interface MyDomainState {
	data: MyDomainData | null;
	isLoading: boolean;
	error: string | null;
}

interface MyDomainActions {
	setData: (data: MyDomainData) => void;
	setLoading: (isLoading: boolean) => void;
	setError: (error: string | null) => void;
	reset: () => void;
}

type MyDomainStore = MyDomainState & MyDomainActions;

const initialState: MyDomainState = {
	data: null,
	isLoading: false,
	error: null,
};

export const useMyDomainStore = create<MyDomainStore>(set => ({
	...initialState,
	setData: data => set({ data }),
	setLoading: isLoading => set({ isLoading }),
	setError: error => set({ error }),
	reset: () => set(initialState),
}));

export const myDomainSelectors = {
	data: ((state: MyDomainStore) => state.data) satisfies StoreSelector<
		MyDomainStore,
		MyDomainData | null
	>,
	isLoading: ((state: MyDomainStore) => state.isLoading) satisfies StoreSelector<
		MyDomainStore,
		boolean
	>,
	error: ((state: MyDomainStore) => state.error) satisfies StoreSelector<
		MyDomainStore,
		string | null
	>,
} as const;
```

## Domain Checklist

When creating a new domain, ensure:

- [ ] Domain directory created with proper structure
- [ ] Page component created in `pages/`
- [ ] Route added to `@core/config/routes.ts`
- [ ] Route registered in `app/router.tsx`
- [ ] Translation files created (`en.json`, `es.json`, `ar.json`)
- [ ] Translation registration file created (`i18n/index.ts`)
- [ ] Translation registration imported in `app/main.tsx`
- [ ] TypeScript types added to `@core/i18n/types/types.ts`
- [ ] Services use `@core/api/createApiService` (if needed)
- [ ] Store uses Zustand with selectors (if needed)
- [ ] No imports from `@infra/*` or `@app/*` (respects boundaries)
- [ ] Unit tests added (if applicable)

## Domain Boundaries

### ✅ Allowed Imports

Domains can import from:

- `@core/*` - Core utilities, hooks, UI components, ports
- `@shared/*` - Shared composite components
- `@src-types/*` - Type definitions
- `@styles/*` - Global styles

### ❌ Forbidden Imports

Domains **cannot** import from:

- `@app/*` - App-level code (except via props/HOCs)
- `@infra/*` - Infrastructure adapters (use ports instead)
- Other domains - Domains should not depend on each other

## Example: Complete Domain

See `src/domains/landing/` for a complete example domain implementation.

## Evolving a Domain

As your domain grows:

1. **Extract shared features** - If used by 2+ domains, move to `domains/shared/*`
2. **Keep UI presentational** - Compose behaviors in hooks/services
3. **Maintain boundaries** - Never import from `infrastructure` or `app`
4. **Split large pages** - Extract widgets/sections to components

## Best Practices

1. **Co-locate related code** - Keep domain code together
2. **Use type-safe routes** - Always use `buildRoute()` from `@core/router/routes.gen`
3. **Validate with Zod** - Use Zod schemas for API responses and forms
4. **Minimal state** - Keep Zustand stores minimal; derive values when possible
5. **Test domain logic** - Unit test services and hooks with MSW
6. **Respect boundaries** - Never break the import rules

## See Also

- [Folder Structure](structure.md) - Detailed project structure
- [API Service Factory](../src/core/api/README.md) - Creating type-safe API services
- [Store Guidelines](../src/domains/landing/store/README.md) - Zustand store best practices
- [i18n Guide](../src/core/i18n/README.md) - Internationalization setup
