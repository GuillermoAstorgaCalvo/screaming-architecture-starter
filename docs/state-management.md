# State Management Guide

This guide explains how to manage state in this application using React Query and Zustand.

## Overview

This project uses two complementary state management solutions:

- **React Query (TanStack Query)**: For server state (API data, caching, synchronization)
- **Zustand**: For client-side domain state (UI state, form state, cross-component state)

## When to Use What?

### Use React Query For:

- ✅ Server data fetching (GET requests)
- ✅ Data mutations (POST, PUT, DELETE)
- ✅ Caching and synchronization
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ Request deduplication

### Use Zustand For:

- ✅ Client-side UI state (modals, drawers, filters)
- ✅ Form state that needs to persist across navigation
- ✅ Cross-component state within a domain
- ✅ Derived state from server data
- ✅ User preferences and settings

### Avoid:

- ❌ Storing server data in Zustand (use React Query cache instead)
- ❌ Using React Query for pure client-side state
- ❌ Global mega-stores (keep Zustand stores domain-scoped)

## React Query Usage

### Setup

React Query is already configured via `QueryProvider` in `app/providers/QueryProvider.tsx` with optimized defaults:

- Stale time: 30 seconds (data is considered fresh for 30s, prevents unnecessary refetches)
- Garbage collection time (gcTime): 5 minutes (React Query v5 uses `gcTime` instead of `cacheTime`)
- Retry: 3 attempts with exponential backoff (max delay 30s)
- Refetch on window focus: production only (helps keep data fresh)
- Refetch on reconnect: enabled
- Refetch on mount: enabled (if data exists, still refetches)
- Mutation retry: 1 attempt with 1s delay

### Basic Query Example

```tsx
import { useQuery } from '@tanstack/react-query';
import { useHttp } from '@core/providers/http/useHttp';
import { createApiService } from '@core/api/createApiService';
import type { ApiService } from '@core/api/createApiService.types';
import type { HttpPort } from '@core/ports/HttpPort';
import { isSuccess } from '@src-types/result';
import { useMemo } from 'react';

// Define your API service factory
function createGetUserService(http: HttpPort): ApiService<{ id: string }, User> {
	return createApiService<{ id: string }, User>(http, {
		endpoint: req => `/api/users/${req.id}`,
		method: 'GET',
		responseSchema: userSchema,
		defaultErrorMessage: 'Failed to load user',
	});
}

// Use in component
function UserProfile({ userId }: { userId: string }) {
	const http = useHttp();
	const getUserService = useMemo(() => createGetUserService(http), [http]);

	const { data, isLoading, error } = useQuery({
		queryKey: ['user', userId],
		queryFn: async () => {
			const result = await getUserService.execute({ id: userId });
			if (!isSuccess(result)) {
				throw result.error;
			}
			return result.data;
		},
		enabled: !!userId, // Only fetch if userId exists
	});

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;
	if (!data) return null;

	return <div>{data.name}</div>;
}
```

### Mutation Example

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useHttp } from '@core/providers/http/useHttp';
import { useToast } from '@core/providers/toast/useToast';
import { createApiService } from '@core/api/createApiService';
import type { ApiService } from '@core/api/createApiService.types';
import type { HttpPort } from '@core/ports/HttpPort';
import { isSuccess } from '@src-types/result';
import { useMemo } from 'react';

function createUpdateUserService(http: HttpPort): ApiService<UserData, User> {
	return createApiService<UserData, User>(http, {
		endpoint: '/api/users',
		method: 'PUT',
		requestMapper: ({ request }) => ({ body: request }),
		responseSchema: userSchema,
		defaultErrorMessage: 'Failed to update user',
	});
}

function EditUserForm({ userId }: { userId: string }) {
	const http = useHttp();
	const queryClient = useQueryClient();
	const toast = useToast();
	const updateUserService = useMemo(() => createUpdateUserService(http), [http]);

	const mutation = useMutation({
		mutationFn: async (userData: UserData) => {
			const result = await updateUserService.execute(userData);
			if (!isSuccess(result)) {
				throw result.error;
			}
			return result.data;
		},
		onSuccess: () => {
			// Invalidate and refetch user data
			queryClient.invalidateQueries({ queryKey: ['user', userId] });
			toast.success('User updated successfully');
		},
		onError: error => {
			toast.error(error.message || 'Failed to update user');
		},
	});

	const handleSubmit = (data: UserData) => {
		mutation.mutate(data);
	};

	return (
		<form onSubmit={handleSubmit}>
			{/* form fields */}
			<button type="submit" disabled={mutation.isPending}>
				{mutation.isPending ? 'Saving...' : 'Save'}
			</button>
		</form>
	);
}
```

### Query Keys Best Practices

- Use arrays for hierarchical keys: `['users', userId]`
- Include all dependencies: `['posts', { userId, page, limit }]`
- Keep keys consistent across the app
- Use query key factories for type safety:

```ts
// queryKeys.ts
export const userKeys = {
	all: ['users'] as const,
	lists: () => [...userKeys.all, 'list'] as const,
	list: (filters: string) => [...userKeys.lists(), { filters }] as const,
	details: () => [...userKeys.all, 'detail'] as const,
	detail: (id: string) => [...userKeys.details(), id] as const,
};
```

## Zustand Usage

### Store Structure

Stores are located in `domains/<domain>/store/*` and follow this pattern:

```tsx
import { create } from 'zustand';

interface MyState {
	count: number;
	isLoading: boolean;
}

interface MyActions {
	increment: () => void;
	decrement: () => void;
	reset: () => void;
}

type MyStore = MyState & MyActions;

export const useMyStore = create<MyStore>(set => ({
	// Initial state
	count: 0,
	isLoading: false,

	// Actions
	increment: () => set(state => ({ count: state.count + 1 })),
	decrement: () => set(state => ({ count: state.count - 1 })),
	reset: () => set({ count: 0, isLoading: false }),
}));
```

### Using Selectors

Always use selectors to prevent unnecessary re-renders:

```tsx
// ✅ Good - only re-renders when count changes
const count = useMyStore(state => state.count);
const increment = useMyStore(state => state.increment);

// ❌ Bad - re-renders on any state change
const { count, increment } = useMyStore();
```

### Pre-defined Selectors

Create selector objects for reusable selectors with type safety:

```tsx
import type { StoreSelector } from '@core/lib/storeUtils';

export const myStoreSelectors = {
	count: ((state: MyStore) => state.count) satisfies StoreSelector<MyStore, number>,
	isLoading: ((state: MyStore) => state.isLoading) satisfies StoreSelector<MyStore, boolean>,
	isPositive: ((state: MyStore) => state.count > 0) satisfies StoreSelector<MyStore, boolean>,
} as const;

// Usage
const count = useMyStore(myStoreSelectors.count);
```

### Combining React Query and Zustand

Use React Query for server data, Zustand for derived client state:

```tsx
function UserDashboard() {
	// Server state from React Query
	const { data: user } = useQuery({
		queryKey: ['user', userId],
		queryFn: () => fetchUser(userId),
	});

	// Client state from Zustand
	const sidebarOpen = useDashboardStore(state => state.sidebarOpen);
	const toggleSidebar = useDashboardStore(state => state.toggleSidebar);

	// Derived state in Zustand (computed from server data)
	const userStats = useDashboardStore(state => state.computeStats(user));

	return (
		<div>
			{sidebarOpen && <Sidebar />}
			<UserStats stats={userStats} />
		</div>
	);
}
```

## Best Practices

### 1. Keep State Local When Possible

```tsx
// ✅ Good - local state for simple UI
const [isOpen, setIsOpen] = useState(false);

// ✅ Good - Zustand for cross-component state
const isModalOpen = useModalStore(state => state.isOpen);
```

### 2. Minimize Zustand State

Only store what you need. Derive values when possible:

```tsx
// ❌ Bad - storing derived value
interface BadStore {
	items: Item[];
	itemCount: number; // Can be derived!
}

// ✅ Good - derive when needed
interface GoodStore {
	items: Item[];
}
const itemCount = useStore(state => state.items.length);
```

### 3. Use React Query for Server State

```tsx
// ❌ Bad - storing server data in Zustand
const users = useUserStore(state => state.users);
const fetchUsers = useUserStore(state => state.fetchUsers);

// ✅ Good - use React Query
const { data: users } = useQuery({
	queryKey: ['users'],
	queryFn: fetchUsers,
});
```

### 4. Domain Scoping

Keep Zustand stores scoped to domains:

```tsx
// ✅ Good - domain-scoped
domains / users / store / userStore.ts;
domains / products / store / productStore.ts;

// ❌ Bad - global store
store / globalStore.ts;
```

## Common Patterns

### Optimistic Updates

```tsx
const mutation = useMutation({
	mutationFn: updateUser,
	onMutate: async newUser => {
		// Cancel outgoing refetches
		await queryClient.cancelQueries({ queryKey: ['user', userId] });

		// Snapshot previous value
		const previousUser = queryClient.getQueryData(['user', userId]);

		// Optimistically update
		queryClient.setQueryData(['user', userId], newUser);

		return { previousUser };
	},
	onError: (err, newUser, context) => {
		// Rollback on error
		queryClient.setQueryData(['user', userId], context.previousUser);
	},
	onSettled: () => {
		// Refetch to ensure consistency
		queryClient.invalidateQueries({ queryKey: ['user', userId] });
	},
});
```

### Dependent Queries

```tsx
const { data: user } = useQuery({
	queryKey: ['user', userId],
	queryFn: () => fetchUser(userId),
});

const { data: posts } = useQuery({
	queryKey: ['posts', userId],
	queryFn: () => fetchUserPosts(userId),
	enabled: !!user, // Only fetch when user exists
});
```

## References

- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Landing Domain Store Example](../src/domains/landing/store/README.md)
- [API Service Factory Guide](./api-service-factory.md)
