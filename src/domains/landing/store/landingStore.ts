/**
 * Landing Domain Zustand Store
 *
 * Manages client-side state for the landing domain, including component filtering.
 * This store demonstrates the Zustand pattern for domain-scoped state management.
 *
 * @example
 * ```tsx
 * // Using selectors (recommended)
 * const searchQuery = useLandingStore(landingSelectors.searchQuery);
 * const setSearchQuery = useLandingStore(landingSelectors.setSearchQuery);
 *
 * // Using inline selectors
 * const selectedTags = useLandingStore(state => state.selectedTags);
 * ```
 */

import type { StoreSelector } from '@core/lib/storeUtils';
import type { CategoryId } from '@domains/landing/pages/landing.types';
import { create } from 'zustand';

/**
 * Landing domain state
 */
interface LandingState {
	/** Active category for component showcase navigation */
	activeCategory: CategoryId;
	/** Search query for filtering components */
	searchQuery: string;
	/** Selected tags for filtering components */
	selectedTags: string[];
}

/**
 * Landing domain actions
 */
interface LandingActions {
	/** Sets the active category */
	setActiveCategory: (category: CategoryId) => void;
	/** Sets the search query */
	setSearchQuery: (query: string) => void;
	/** Toggles a tag in the selected tags array */
	toggleTag: (tag: string) => void;
	/** Clears all filters (search query and selected tags) */
	clearFilters: () => void;
}

/**
 * Landing domain store type
 */
type LandingStore = LandingState & LandingActions;

/**
 * Initial state for the landing store
 */
const initialState: LandingState = {
	activeCategory: 'root',
	searchQuery: '',
	selectedTags: [],
};

/**
 * Landing domain Zustand store
 *
 * Provides state management for component filtering in the landing domain.
 * Uses Zustand for efficient, selector-based state access.
 */
export const useLandingStore = create<LandingStore>(set => ({
	...initialState,

	setActiveCategory: (category: CategoryId) => {
		set({ activeCategory: category });
	},

	setSearchQuery: (query: string) => {
		set({ searchQuery: query });
	},

	toggleTag: (tag: string) => {
		set(state => {
			if (state.selectedTags.includes(tag)) {
				return {
					selectedTags: state.selectedTags.filter(t => t !== tag),
				};
			}
			return {
				selectedTags: [...state.selectedTags, tag],
			};
		});
	},

	clearFilters: () => {
		set(initialState);
	},
}));

/**
 * Pre-defined selectors for the landing store
 *
 * Using selectors prevents unnecessary re-renders by subscribing only to
 * the specific state slices that components need.
 *
 * @example
 * ```tsx
 * const searchQuery = useLandingStore(landingSelectors.searchQuery);
 * const setSearchQuery = useLandingStore(landingSelectors.setSearchQuery);
 * ```
 */
export const landingSelectors = {
	/** Selector for active category */
	activeCategory: ((state: LandingStore) => state.activeCategory) satisfies StoreSelector<
		LandingStore,
		CategoryId
	>,

	/** Selector for setActiveCategory action */
	setActiveCategory: ((state: LandingStore) => state.setActiveCategory) satisfies StoreSelector<
		LandingStore,
		(category: CategoryId) => void
	>,

	/** Selector for search query */
	searchQuery: ((state: LandingStore) => state.searchQuery) satisfies StoreSelector<
		LandingStore,
		string
	>,

	/** Selector for setSearchQuery action */
	setSearchQuery: ((state: LandingStore) => state.setSearchQuery) satisfies StoreSelector<
		LandingStore,
		(query: string) => void
	>,

	/** Selector for selected tags */
	selectedTags: ((state: LandingStore) => state.selectedTags) satisfies StoreSelector<
		LandingStore,
		string[]
	>,

	/** Selector for toggleTag action */
	toggleTag: ((state: LandingStore) => state.toggleTag) satisfies StoreSelector<
		LandingStore,
		(tag: string) => void
	>,

	/** Selector for clearFilters action */
	clearFilters: ((state: LandingStore) => state.clearFilters) satisfies StoreSelector<
		LandingStore,
		() => void
	>,

	/** Derived selector: checks if any filters are active */
	hasActiveFilters: ((state: LandingStore) =>
		state.searchQuery.trim() !== '' || state.selectedTags.length > 0) satisfies StoreSelector<
		LandingStore,
		boolean
	>,

	/** Derived selector: gets the count of selected tags */
	selectedTagsCount: ((state: LandingStore) => state.selectedTags.length) satisfies StoreSelector<
		LandingStore,
		number
	>,
} as const;
