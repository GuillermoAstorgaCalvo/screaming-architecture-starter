# Providers Guide

This guide explains how to use the various provider hooks available in the application.

## Overview

Providers are React contexts that provide access to core functionality throughout the application. All providers are already set up in `app/App.tsx`, so you can use their hooks anywhere in your components.

## Available Providers

### Auth Provider

Access authentication state and operations.

**Hook**: `useAuth()`

```tsx
import { useAuth } from '@core/providers/auth/useAuth';

function MyComponent() {
	const {
		auth, // AuthPort implementation
		tokens, // Current auth tokens
		accessToken, // Convenience: access token string
		refreshToken, // Convenience: refresh token string
		isAuthenticated, // Boolean: is user authenticated?
		roles, // User roles array
		permissions, // User permissions object
	} = useAuth();

	if (!isAuthenticated) {
		return <div>Please log in</div>;
	}

	return (
		<div>
			<p>Logged in as: {roles.join(', ')}</p>
			<button onClick={() => auth.logout()}>Logout</button>
		</div>
	);
}
```

**Available Methods** (via `auth`):

- `login(credentials)`: Authenticate user
- `logout()`: Sign out user
- `refresh()`: Refresh access token
- `getTokens()`: Get current tokens
- `setTokens(tokens)`: Set tokens manually

### HTTP Provider

Access the HTTP client for making API requests.

**Hook**: `useHttp()`

```tsx
import { useHttp } from '@core/providers/http/useHttp';

function MyComponent() {
	const http = useHttp();

	const fetchData = async () => {
		try {
			const response = await http.get('/api/users');
			console.log(response.data);
		} catch (error) {
			console.error('Request failed:', error);
		}
	};

	return <button onClick={fetchData}>Fetch Data</button>;
}
```

**Available Methods**:

- `get(url, config?)`: GET request
- `post(url, data?, config?)`: POST request
- `put(url, data?, config?)`: PUT request
- `patch(url, data?, config?)`: PATCH request
- `delete(url, config?)`: DELETE request

**Note**: Prefer using `createApiService` for type-safe API calls. See [API Service Factory Guide](./api-service-factory.md).

### Storage Provider

Access browser storage (localStorage/sessionStorage abstraction).

**Hook**: `useStorage()`

```tsx
import { useStorage } from '@core/providers/storage/useStorage';

function MyComponent() {
	const storage = useStorage();

	const savePreference = () => {
		storage.setItem('theme', 'dark');
	};

	const getPreference = () => {
		const theme = storage.getItem('theme');
		return theme || 'light';
	};

	return (
		<div>
			<button onClick={savePreference}>Save Theme</button>
			<p>Current theme: {getPreference()}</p>
		</div>
	);
}
```

**Available Methods**:

- `getItem(key)`: Get item (returns string or null)
- `setItem(key, value)`: Set item (value must be string)
- `removeItem(key)`: Remove item
- `clear()`: Clear all items
- `key(index)`: Get key at index
- `getLength()`: Get number of items

**Note**: For React hooks with automatic sync, use `useLocalStorage` or `useSessionStorage` instead.

### Logger Provider

Access logging functionality.

**Hook**: `useLogger()`

```tsx
import { useLogger } from '@core/providers/logger/useLogger';

function MyComponent() {
	const logger = useLogger();

	const handleAction = () => {
		logger.info('Action performed', { userId: '123' });
		logger.warn('This is a warning', { context: 'payment' });
		logger.error('Something went wrong', { error: new Error('Failed') });
		logger.debug('Debug information', { data: someData });
	};

	return <button onClick={handleAction}>Perform Action</button>;
}
```

**Available Methods**:

- `info(message, context?)`: Log info message
- `warn(message, context?)`: Log warning
- `error(message, context?)`: Log error
- `debug(message, context?)`: Log debug message

### Toast Provider

Show toast notifications to users.

**Hook**: `useToast()`

```tsx
import { useToast } from '@core/providers/toast/useToast';

function MyComponent() {
	const toast = useToast();

	const handleSuccess = () => {
		toast.success('Operation completed successfully!');
	};

	const handleError = () => {
		toast.error('Something went wrong', {
			description: 'Please try again later',
			action: {
				label: 'Retry',
				onClick: () => console.log('Retrying...'),
			},
		});
	};

	const handleInfo = () => {
		toast.info('New message received', {
			autoDismiss: true,
			dismissAfter: 3000,
		});
	};

	return (
		<div>
			<button onClick={handleSuccess}>Success</button>
			<button onClick={handleError}>Error</button>
			<button onClick={handleInfo}>Info</button>
		</div>
	);
}
```

**Available Methods**:

- `success(message | options)`: Show success toast
- `error(message | options)`: Show error toast
- `warning(message | options)`: Show warning toast
- `info(message | options)`: Show info toast
- `show(intent, options)`: Show toast with custom intent
- `dismiss(id)`: Dismiss specific toast
- `clear()`: Clear all toasts

**Toast Options**:

```tsx
interface ToastOptions {
	title?: string;
	description?: string | ReactNode;
	children?: ReactNode;
	className?: string;
	dismissLabel?: string;
	autoDismiss?: boolean;
	dismissAfter?: number; // milliseconds
	pauseOnHover?: boolean;
	action?: {
		label: string;
		onClick: () => void;
	};
	role?: 'status' | 'alert';
}
```

### Snackbar Provider

Lightweight alternative to toast notifications.

**Hook**: `useSnackbar()`

```tsx
import { useSnackbar } from '@core/providers/snackbar/useSnackbar';

function MyComponent() {
	const snackbar = useSnackbar();

	const showMessage = () => {
		snackbar.show('Item saved', {
			intent: 'success',
			duration: 2000,
		});
	};

	return <button onClick={showMessage}>Save</button>;
}
```

**Available Methods**:

- `show(message, options?)`: Show snackbar
- `success(message, options?)`: Show success snackbar
- `error(message, options?)`: Show error snackbar
- `info(message, options?)`: Show info snackbar
- `warning(message, options?)`: Show warning snackbar
- `dismiss()`: Dismiss current snackbar

### Analytics Provider

Track events and page views.

**Hook**: `useAnalytics()`

```tsx
import { useAnalytics } from '@core/providers/analytics/useAnalytics';

function MyComponent() {
	const analytics = useAnalytics();

	const handlePurchase = () => {
		analytics.trackEvent({
			name: 'purchase',
			params: {
				productId: '123',
				amount: 99.99,
				currency: 'USD',
			},
		});
	};

	useEffect(() => {
		analytics.trackPageView({
			path: '/checkout',
			title: 'Checkout Page',
		});
	}, []);

	return <button onClick={handlePurchase}>Buy Now</button>;
}
```

**Available Methods**:

- `trackEvent(event: AnalyticsEvent)`: Track custom event (event object with `name` and optional `params`)
- `trackPageView(page: AnalyticsPageView)`: Track page view (page object with `path` and optional `title`, `location`)
- `identify(identity: AnalyticsIdentity)`: Identify user (identity object with optional `userId` and `traits`)
- `setUserProperties(properties: AnalyticsUserProperties)`: Set user properties (object with key-value pairs)
- `reset(options?)`: Reset analytics state (e.g., on logout)

## Provider Composition

All providers are composed in `app/App.tsx` in this order:

1. `LoggerProvider` - Logging (outermost, provides logger to ErrorBoundary)
2. `ErrorBoundaryWrapper` - Error boundaries (uses logger from context, renders Error500 as fallback)
3. `HttpProvider` - HTTP client (provides httpClient implementing HttpPort)
4. `AuthProvider` - Authentication (provides JwtAuthAdapter implementing AuthPort)
5. `StorageProvider` - Storage (provides localStorageAdapter implementing StoragePort, must be before ThemeProvider since ThemeProvider uses storage)
6. `ThemeProvider` - Theme (app-specific, light/dark/system with persistence)
7. `I18nProvider` - Internationalization (app-specific, provides i18next instance)
8. `QueryProvider` - React Query (app-specific, TanStack Query v5 with optimized defaults: staleTime 30s, gcTime 5min, retry 3)
9. `AnalyticsProvider` - Analytics (toggles between googleAnalyticsAdapter and noopAnalyticsAdapter based on env.ANALYTICS_ENABLED, config determined by getAnalyticsConfig() checking runtime config and environment variables)
10. `MotionProvider` - Animations (Framer Motion with reduced-motion support)
11. `ToastProvider` - Toast notifications (queue management)
12. `BrowserRouter` - Routing (React Router v7)
13. `LayoutGroup` - Framer Motion route transitions (inside BrowserRouter, groups route transitions with id="app-route-transitions")
14. `Router` - App routes (lazy-loaded pages with Suspense, inside LayoutGroup)
15. `ToastContainer` - Renders toast notifications (inside ToastProvider but outside BrowserRouter for proper context access)

**Note**: The `useHttpClientAuth` hook is called at the App component level (before providers) to sync AuthPort tokens with HttpPort interceptor. This ensures the HTTP client automatically includes authentication tokens in requests.

**Important Notes:**

- The `useHttpClientAuth` hook is called at the App component level (before providers) to sync AuthPort tokens with HttpPort interceptor
- `AnalyticsProvider` conditionally uses `googleAnalyticsAdapter` or `noopAnalyticsAdapter` based on `env.ANALYTICS_ENABLED`
- Analytics configuration is determined by `getAnalyticsConfig()` helper function in `App.tsx` which checks runtime config (`ANALYTICS_WRITE_KEY` from `runtime-config.json`) and environment variables (`GA_MEASUREMENT_ID`, `GA_DEBUG`, `GA_DATALAYER_NAME`)
- Runtime config takes precedence over environment variables for the analytics write key
- `ToastContainer` is placed inside `ToastProvider` but outside `BrowserRouter` to ensure proper context access
- All adapters are instantiated at the App level and injected via providers (respects hexagonal architecture boundaries)

## Best Practices

### 1. Use Hooks, Not Context Directly

```tsx
// ✅ Good
const auth = useAuth();

// ❌ Bad
const auth = useContext(AuthContext);
```

### 2. Handle Provider Errors

All provider hooks throw errors if used outside their provider:

```tsx
// ✅ Good - handle error gracefully
try {
	const auth = useAuth();
	// use auth
} catch (error) {
	// Component used outside AuthProvider
}
```

### 3. Prefer Specialized Hooks

For storage, prefer React hooks over direct storage access:

```tsx
// ✅ Good - automatic sync and React state
const [theme, setTheme] = useLocalStorage('theme', 'light');

// ⚠️ Less ideal - manual sync needed
const storage = useStorage();
const [theme, setTheme] = useState(storage.getItem('theme'));
```

### 4. Use Toast for User Feedback

```tsx
// ✅ Good - user-visible feedback
const toast = useToast();
toast.success('Saved successfully');

// ❌ Bad - only in console
console.log('Saved successfully');
```

## Related Documentation

- [State Management Guide](./state-management.md) - React Query and Zustand
- [API Service Factory Guide](./api-service-factory.md) - Type-safe API calls
- [Storage Hooks](../src/core/hooks/storage/useLocalStorage.ts) - React storage hooks
