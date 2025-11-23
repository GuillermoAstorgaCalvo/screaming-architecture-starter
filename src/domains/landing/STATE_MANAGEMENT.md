# State Management in Landing Domain

This document outlines where and why Zustand is used in the landing domain, and where `useState` remains appropriate.

## Zustand Usage

Zustand is used for **cross-component state** that needs to be shared across multiple components or persist across navigation.

### Current Zustand Store State

The `landingStore` manages the following state:

1. **`activeCategory`** - Active category for component showcase navigation
   - **Why Zustand**: Shared between `LandingPage` and `LandingPageHeader` components
   - **Usage**: Navigation state that persists as user switches categories

2. **`searchQuery`** - Search query for filtering components
   - **Why Zustand**: Shared across multiple components (search bar, filter context, showcase components)
   - **Usage**: Cross-component filtering state

3. **`selectedTags`** - Selected tags for filtering components
   - **Why Zustand**: Shared across multiple components (tag filters, showcase components)
   - **Usage**: Cross-component filtering state

### Zustand Store Location

- **Store**: `src/domains/landing/store/landingStore.ts`
- **Selectors**: Pre-defined selectors in `landingSelectors` object
- **Usage**: Components use `useLandingStore(landingSelectors.*)` for efficient state access

## useState Usage

`useState` is used for **local component state** that doesn't need to be shared.

### Appropriate useState Usage

1. **Showcase Component State** - Form inputs, overlay states, hook demos
   - **Location**: `src/domains/landing/components/categories/*/state.ts`
   - **Why useState**: Local to individual showcase components, not shared
   - **Examples**:
     - `useFormsCategoryState()` - Form input values for demos
     - `useOverlayState()` - Dialog/modal open states for demos
     - `useHooksState()` - Input values for hook demonstrations

2. **Component-Level UI State** - Toggles, local interactions
   - **Why useState**: Simple UI state that doesn't need to persist or be shared
   - **Examples**: Collapsible sections, local tooltips, component-specific interactions

## Decision Guidelines

### Use Zustand When:

- ✅ State is shared across multiple components
- ✅ State needs to persist across navigation
- ✅ State is part of domain-level UI (not component-specific)
- ✅ State is used in multiple places within the domain

### Use useState When:

- ✅ State is local to a single component
- ✅ State is for showcase/demo purposes only
- ✅ State doesn't need to persist or be shared
- ✅ State is component-specific UI state (toggles, local interactions)

## Examples

### Zustand Example (Cross-Component State)

```tsx
// LandingPage.tsx
const activeCategory = useLandingStore(landingSelectors.activeCategory);
const setActiveCategory = useLandingStore(landingSelectors.setActiveCategory);

// LandingPageHeader.tsx (receives via props, but could also use store directly)
// State is shared between these components
```

### useState Example (Local Component State)

```tsx
// FormsCategory.tsx
function FormsCategory() {
	// Local state for showcase - not shared with other components
	const formState = useFormsCategoryState(); // Uses useState internally

	return <FormShowcase {...formState} />;
}
```

## Integration with React Context

The `ComponentFilterContext` wraps the Zustand store to provide backward compatibility and demonstrate integration patterns:

```tsx
// ComponentFilterContext.tsx uses Zustand internally
const searchQuery = useLandingStore(landingSelectors.searchQuery);
// ... provides context value that wraps store state
```

This allows components to use either:

- Direct store access: `useLandingStore(landingSelectors.searchQuery)`
- Context access: `useComponentFilterContext().searchQuery`

## References

- See `store/README.md` for detailed store documentation
- See `docs/state-management.md` for project-wide state management guidelines
- See `.cursor/rules/architecture/state.mdc` for architecture rules
