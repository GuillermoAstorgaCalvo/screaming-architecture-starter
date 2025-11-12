# Landing Domain Store

This directory contains Zustand stores for the landing domain, following the project's state management guidelines.

## Architecture

- **Location**: `domains/<domain>/store/*`
- **Pattern**: One store per domain concern
- **Naming**: Stores end with `Store` (e.g., `landingStore.ts`)

## Best Practices

### 1. Type Safety

- Define clear TypeScript interfaces for state and actions
- Use proper typing with Zustand's `create` function

### 2. Selectors for Performance

- Use selectors to prevent unnecessary re-renders
- Prefer granular selectors over selecting entire state

```tsx
// ✅ Good - only re-renders when count changes
const count = useLandingStore(state => state.count);

// ❌ Avoid - re-renders on any state change
const { count } = useLandingStore();
```

### 3. Immutability

- Zustand handles immutability automatically
- Always return new state objects in actions

### 4. Minimal State

- Keep only necessary state in the store
- Derive computed values when possible
- Use React Query for server state

### 5. Domain Scoping

- Keep stores domain-specific
- Avoid global mega-stores
- Use selector-only bridges for cross-domain composition if needed

## Usage Example

```tsx
import { useLandingStore, landingSelectors } from '@domains/landing/store/landingStore';

function MyComponent() {
	// Using inline selector
	const count = useLandingStore(state => state.count);
	const increment = useLandingStore(state => state.increment);

	// Using pre-defined selector
	const isLoading = useLandingStore(landingSelectors.isLoading);

	return (
		<div>
			<p>Count: {count}</p>
			<button onClick={increment} disabled={isLoading}>
				Increment
			</button>
		</div>
	);
}
```

## Store Structure

```typescript
// 1. Define state interface
interface MyState {
	// state properties
}

// 2. Define actions interface
interface MyActions {
	// action methods
}

// 3. Combine types
type MyStore = MyState & MyActions;

// 4. Create store
export const useMyStore = create<MyStore>(set => ({
	// initial state
	// actions
}));

// 5. Export selectors (optional but recommended)
export const mySelectors = {
	// selector functions
};
```

## Current Implementation

The existing `landingStore.ts` demonstrates these patterns with a simple counter domain:

- **State**: `count`, `isLoading`, and `error`
- **Actions**: `increment`, `decrement`, `reset`, `setLoading`, `setError`
- **Selectors**: `landingSelectors.count`, `landingSelectors.isLoading`, `landingSelectors.error`, `landingSelectors.countWithIncrement`
- **Typing**: Re-uses `StoreSelector` from `@core/lib/storeUtils` for selector return types

Use it as a reference when adding new stores or extending the landing domain.

## Related Documentation

- State Management Guidelines: `.cursor/rules/architecture/state.mdc`
- Domain Structure: `.cursor/rules/architecture/folder-structure-domains-shared.mdc`
- Conventions: `.cursor/rules/quality/conventions.mdc`
