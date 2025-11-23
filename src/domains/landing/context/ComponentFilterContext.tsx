import { landingSelectors, useLandingStore } from '@domains/landing/store/landingStore';
import { type ReactNode, useMemo } from 'react';

import { ComponentFilterContext } from './componentFilterContext.constants';

/**
 * ComponentFilterProvider
 *
 * Provides component filter context by integrating with the Zustand store.
 * This demonstrates how to use Zustand stores with React Context for
 * backward compatibility or when Context is needed for component composition.
 */
export function ComponentFilterProvider({ children }: { readonly children: ReactNode }) {
	// Use Zustand store selectors for efficient state access
	const searchQuery = useLandingStore(landingSelectors.searchQuery);
	const setSearchQuery = useLandingStore(landingSelectors.setSearchQuery);
	const selectedTags = useLandingStore(landingSelectors.selectedTags);
	const toggleTag = useLandingStore(landingSelectors.toggleTag);
	const clearFilters = useLandingStore(landingSelectors.clearFilters);

	const contextValue = useMemo(
		() => ({
			searchQuery,
			setSearchQuery,
			selectedTags,
			toggleTag,
			clearFilters,
		}),
		[searchQuery, setSearchQuery, selectedTags, toggleTag, clearFilters]
	);

	return (
		<ComponentFilterContext.Provider value={contextValue}>
			{children}
		</ComponentFilterContext.Provider>
	);
}
