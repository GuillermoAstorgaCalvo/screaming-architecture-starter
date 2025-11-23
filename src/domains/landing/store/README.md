# Landing Domain Store

This directory contains Zustand stores for managing client-side state in the landing domain.

## Store Structure

### `landingStore.ts`

The main store for the landing domain, managing component filtering state.

**State:**

- `activeCategory: CategoryId` - Active category for component showcase navigation
- `searchQuery: string` - Search query for filtering components
- `selectedTags: string[]` - Selected tags for filtering components

**Actions:**

- `setActiveCategory(category: CategoryId)` - Sets the active category
- `setSearchQuery(query: string)` - Sets the search query
- `toggleTag(tag: string)` - Toggles a tag in the selected tags array
- `clearFilters()` - Clears all filters (search query and selected tags)

**Selectors:**

- `landingSelectors.activeCategory` - Get active category
- `landingSelectors.setActiveCategory` - Get setActiveCategory action
- `landingSelectors.searchQuery` - Get search query
- `landingSelectors.setSearchQuery` - Get setSearchQuery action
- `landingSelectors.selectedTags` - Get selected tags
- `landingSelectors.toggleTag` - Get toggleTag action
- `landingSelectors.clearFilters` - Get clearFilters action
- `landingSelectors.hasActiveFilters` - Derived: checks if any filters are active
- `landingSelectors.selectedTagsCount` - Derived: gets the count of selected tags

## Usage Examples

### Using Selectors (Recommended)

```tsx
import { landingSelectors, useLandingStore } from '@domains/landing/store/landingStore';

function ComponentSearchBar() {
	// Using pre-defined selectors (prevents unnecessary re-renders)
	const searchQuery = useLandingStore(landingSelectors.searchQuery);
	const setSearchQuery = useLandingStore(landingSelectors.setSearchQuery);
	const hasActiveFilters = useLandingStore(landingSelectors.hasActiveFilters);
	const clearFilters = useLandingStore(landingSelectors.clearFilters);

	return (
		<div>
			<input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
			{hasActiveFilters && <button onClick={clearFilters}>Clear</button>}
		</div>
	);
}

function CategoryNavigation() {
	// Managing navigation state with Zustand
	const activeCategory = useLandingStore(landingSelectors.activeCategory);
	const setActiveCategory = useLandingStore(landingSelectors.setActiveCategory);

	return (
		<nav>
			{categories.map(category => (
				<button
					key={category.id}
					onClick={() => setActiveCategory(category.id)}
					className={activeCategory === category.id ? 'active' : ''}
				>
					{category.label}
				</button>
			))}
		</nav>
	);
}
```

### Using Inline Selectors

```tsx
import { useLandingStore } from '@domains/landing/store/landingStore';

function TagFilter() {
	// Inline selector (also prevents unnecessary re-renders)
	const selectedTags = useLandingStore(state => state.selectedTags);
	const toggleTag = useLandingStore(state => state.toggleTag);

	return (
		<div>
			{tags.map(tag => (
				<button
					key={tag}
					onClick={() => toggleTag(tag)}
					className={selectedTags.includes(tag) ? 'active' : ''}
				>
					{tag}
				</button>
			))}
		</div>
	);
}
```

### Integration with React Context

The store is integrated with `ComponentFilterContext` to maintain backward compatibility:

```tsx
// ComponentFilterContext.tsx uses the store internally
const searchQuery = useLandingStore(landingSelectors.searchQuery);
const setSearchQuery = useLandingStore(landingSelectors.setSearchQuery);
// ... provides context value that wraps store state
```

This allows components to use either:

- Direct store access: `useLandingStore(landingSelectors.searchQuery)`
- Context access: `useComponentFilterContext().searchQuery`

## Best Practices

1. **Always use selectors** - Prevents unnecessary re-renders by subscribing only to needed state slices
2. **Use pre-defined selectors** - Better for reusability and type safety
3. **Derive state when possible** - Use computed selectors instead of storing derived values
4. **Keep state minimal** - Only store what's necessary, derive the rest
5. **Domain-scoped** - Keep stores scoped to their domain, avoid global stores

## Type Safety

The store uses TypeScript with `StoreSelector` types from `@core/lib/storeUtils` to ensure type-safe selectors:

```tsx
export const landingSelectors = {
	searchQuery: ((state: LandingStore) => state.searchQuery) satisfies StoreSelector<
		LandingStore,
		string
	>,
	// ... other selectors
} as const;
```

## References

- See `docs/state-management.md` for comprehensive state management guidelines
- See `.cursor/rules/architecture/state.mdc` for state management architecture
- See `docs/creating-domains.md` for domain store patterns
