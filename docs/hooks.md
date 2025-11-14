# Hooks Guide

This guide covers the custom React hooks available in the application and when to use them.

## Overview

The application provides various custom hooks organized by category:

- **Data Fetching**: `useFetch`, `useAsync`
- **Storage**: `useLocalStorage`, `useSessionStorage`
- **HTTP**: `useHttpClientAuth`
- **UI**: `useMediaQuery`, `useToggle`, `usePrevious`, `useWindowSize`
- **Scroll**: `useScrollPosition`
- **Motion**: `useInView`, `useMotionValue`, `useScrollProgress`, etc.
- **SEO**: `useSEO`
- **Utilities**: `useDebounce`, `useThrottle`, `useInterval`

## Data Fetching Hooks

### useFetch

Generic data fetching hook with automatic loading and error state management.

```tsx
import { useFetch } from '@core/hooks/fetch/useFetch';

function UserList() {
	const { data, loading, error, fetch, reset } = useFetch<User[]>('/api/users', {
		autoFetch: true, // Automatically fetch on mount
	});

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!data) return null;

	return (
		<div>
			{data.map(user => (
				<div key={user.id}>{user.name}</div>
			))}
			<button onClick={fetch}>Refresh</button>
		</div>
	);
}
```

**Options**:

- `autoFetch`: Automatically fetch on mount (default: `false`)
- `dependencies`: Array of dependencies to refetch when changed
- All standard HTTP config options (headers, method, body, etc.)

**When to Use**:

- Simple data fetching without React Query
- One-off API calls
- When you need manual control over fetching

**When NOT to Use**:

- For server state that needs caching (use React Query instead)
- For data that needs background refetching (use React Query instead)

### useAsync

More flexible async execution hook that accepts any async function.

```tsx
import { useAsync } from '@core/hooks/async/useAsync';

function DataProcessor() {
	const { data, loading, error, execute, cancel } = useAsync(
		async signal => {
			// Your async operation
			const result = await processLargeDataset(signal);
			return result;
		},
		{
			immediate: false, // Don't execute on mount
			onSuccess: data => console.log('Success:', data),
			onError: error => console.error('Error:', error),
		}
	);

	return (
		<div>
			<button onClick={execute} disabled={loading}>
				{loading ? 'Processing...' : 'Process Data'}
			</button>
			{loading && <button onClick={cancel}>Cancel</button>}
			{error && <div>Error: {error}</div>}
			{data && <div>Result: {data}</div>}
		</div>
	);
}
```

**Options**:

- `immediate`: Execute immediately on mount (default: `false`)
- `dependencies`: Array of dependencies to re-execute when changed
- `onSuccess`: Callback on success
- `onError`: Callback on error
- `onComplete`: Callback on completion (success or error)
- `signal`: AbortSignal for cancellation

**When to Use**:

- Complex async operations beyond simple HTTP requests
- Operations that need cancellation support
- When you need more control than `useFetch` provides

## Storage Hooks

### useLocalStorage

React hook for localStorage with automatic sync across tabs.

```tsx
import { useLocalStorage } from '@core/hooks/storage/useLocalStorage';
import { z } from 'zod';

// With Zod validation
const themeSchema = z.enum(['light', 'dark', 'system']);

function ThemeSelector() {
	const [theme, setTheme, removeTheme] = useLocalStorage(
		'theme',
		'light',
		themeSchema // Optional: validates stored value
	);

	return (
		<select value={theme} onChange={e => setTheme(e.target.value as 'light' | 'dark' | 'system')}>
			<option value="light">Light</option>
			<option value="dark">Dark</option>
			<option value="system">System</option>
		</select>
	);
}
```

**Features**:

- Automatic synchronization across browser tabs
- Optional Zod schema validation
- Type-safe with TypeScript
- Returns `[value, setValue, removeValue]` tuple

**When to Use**:

- User preferences that should persist
- Settings that need to survive page refreshes
- Data that should sync across tabs

### useSessionStorage

Same as `useLocalStorage` but uses `sessionStorage` (cleared on tab close).

```tsx
import { useSessionStorage } from '@core/hooks/storage/useSessionStorage';

function TemporaryData() {
	const [tempData, setTempData] = useSessionStorage('temp', null);

	return (
		<div>
			<button onClick={() => setTempData({ key: 'value' })}>Save</button>
			<button onClick={() => setTempData(null)}>Clear</button>
		</div>
	);
}
```

**When to Use**:

- Temporary data that should clear when tab closes
- Form drafts that shouldn't persist across sessions
- Session-specific state

## UI Hooks

### useMediaQuery

React hook for CSS media queries.

```tsx
import { useMediaQuery } from '@core/hooks/ui/useMediaQuery';

function ResponsiveComponent() {
	const isMobile = useMediaQuery('(max-width: 768px)');
	const isDark = useMediaQuery('(prefers-color-scheme: dark)');

	return (
		<div>
			{isMobile ? <MobileLayout /> : <DesktopLayout />}
			{isDark && <p>Dark mode detected</p>}
		</div>
	);
}
```

**Options**:

- `defaultMatches`: Default value before media query is evaluated (SSR)

**When to Use**:

- Responsive design logic
- Feature detection
- Theme detection

### useToggle

Simple boolean toggle hook.

```tsx
import { useToggle } from '@core/hooks/ui/useToggle';

function ToggleExample() {
	const [isOpen, toggle, setOpen, setClosed] = useToggle(false);

	return (
		<div>
			<button onClick={toggle}>Toggle</button>
			<button onClick={setOpen}>Open</button>
			<button onClick={setClosed}>Close</button>
			{isOpen && <div>Content</div>}
		</div>
	);
}
```

**Returns**: `[value, toggle, setTrue, setFalse]`

**When to Use**:

- Simple boolean state (modals, dropdowns, etc.)
- When you need toggle functionality

### usePrevious

Get the previous value of a prop or state.

```tsx
import { usePrevious } from '@core/hooks/ui/usePrevious';

function Counter({ count }: { count: number }) {
	const prevCount = usePrevious(count);
	const increased = prevCount !== undefined && count > prevCount;

	return (
		<div>
			<p>Count: {count}</p>
			{increased && <p>Count increased!</p>}
		</div>
	);
}
```

**When to Use**:

- Comparing current vs previous values
- Detecting changes
- Animation triggers

### useWindowSize

Track window dimensions.

```tsx
import { useWindowSize } from '@core/hooks/ui/useWindowSize';

function ResponsiveLayout() {
	const { width, height } = useWindowSize();
	const isMobile = width < 768;

	return <div>{isMobile ? <MobileView /> : <DesktopView />}</div>;
}
```

**Returns**: `{ width: number, height: number }`

**When to Use**:

- Responsive layouts
- When you need exact window dimensions
- Dynamic sizing calculations

## Scroll Hooks

### useScrollPosition

Track scroll position.

```tsx
import { useScrollPosition } from '@core/hooks/scroll/useScrollPosition';

function ScrollIndicator() {
	const { x, y, isScrolling } = useScrollPosition();

	return (
		<div>
			<p>
				Scroll: {x}, {y}
			</p>
			{isScrolling && <p>Scrolling...</p>}
		</div>
	);
}
```

**Returns**: `{ x: number, y: number, isScrolling: boolean }`

**When to Use**:

- Scroll-based animations
- Sticky headers
- Scroll indicators

## Utility Hooks

### useDebounce

Debounce a value.

```tsx
import { useDebounce } from '@core/hooks/debounce/useDebounce';
import { useState } from 'react';

function SearchInput() {
	const [query, setQuery] = useState('');
	const debouncedQuery = useDebounce(query, 500); // 500ms delay

	// Effect runs only after user stops typing for 500ms
	useEffect(() => {
		if (debouncedQuery) {
			performSearch(debouncedQuery);
		}
	}, [debouncedQuery]);

	return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

**When to Use**:

- Search inputs
- API calls on input change
- Expensive operations triggered by user input

### useThrottle

Throttle a value.

```tsx
import { useThrottle } from '@core/hooks/throttle/useThrottle';

function ScrollHandler() {
	const scrollY = useScrollPosition().y;
	const throttledScrollY = useThrottle(scrollY, 100); // Max once per 100ms

	useEffect(() => {
		updateScrollIndicator(throttledScrollY);
	}, [throttledScrollY]);
}
```

**When to Use**:

- Scroll handlers
- Resize handlers
- Frequent events that need rate limiting

### useInterval

Run a function at intervals.

```tsx
import { useInterval } from '@core/hooks/interval/useInterval';
import { useState } from 'react';

function Timer() {
	const [seconds, setSeconds] = useState(0);

	useInterval(() => {
		setSeconds(s => s + 1);
	}, 1000); // Every second

	return <div>Elapsed: {seconds}s</div>;
}
```

**When to Use**:

- Timers
- Polling
- Periodic updates

## SEO Hook

### useSEO

Set SEO metadata for the page.

```tsx
import { useSEO } from '@core/hooks/seo/useSEO';

function ProductPage({ product }: { product: Product }) {
	useSEO({
		title: product.name,
		description: product.description,
		image: product.imageUrl,
		type: 'product',
	});

	return <div>{product.name}</div>;
}
```

**When to Use**:

- Page-specific SEO metadata
- Dynamic meta tags
- Open Graph tags

## Motion Hooks

For animation and motion, see the motion hooks:

- `useInView`: Detect when element enters viewport
- `useMotionValue`: Animate values
- `useScrollProgress`: Track scroll progress
- `useMotionSpring`: Spring animations
- And more...

See `src/core/hooks/motion/` for details.

## Best Practices

### 1. Choose the Right Hook

```tsx
// ✅ Good - useLocalStorage for persistent data
const [theme, setTheme] = useLocalStorage('theme', 'light');

// ❌ Bad - useState for persistent data
const [theme, setTheme] = useState('light'); // Lost on refresh
```

### 2. Use React Query for Server State

```tsx
// ✅ Good - React Query for server data
const { data } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });

// ⚠️ Less ideal - useFetch for server data (no caching)
const { data } = useFetch('/api/users', { autoFetch: true });
```

### 3. Debounce Expensive Operations

```tsx
// ✅ Good - debounce search
const debouncedQuery = useDebounce(query, 300);

// ❌ Bad - search on every keystroke
useEffect(() => {
	performSearch(query); // Too many API calls!
}, [query]);
```

### 4. Validate Storage Values

```tsx
// ✅ Good - validate with Zod
const [theme, setTheme] = useLocalStorage('theme', 'light', themeSchema);

// ⚠️ Less safe - no validation
const [theme, setTheme] = useLocalStorage('theme', 'light');
```

## Related Documentation

- [State Management Guide](./state-management.md) - React Query patterns
- [Providers Guide](./providers.md) - Provider hooks
- [API Service Factory Guide](./api-service-factory.md) - Type-safe API calls
