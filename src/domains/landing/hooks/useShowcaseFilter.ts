import { useMemo } from 'react';

import { useComponentFilterContext } from './useComponentFilterContext';

/**
 * Hook to determine if a component should be shown based on current filters
 */
export function useShowcaseFilter(title: string, tags: readonly string[] = []) {
	const { searchQuery, selectedTags } = useComponentFilterContext();

	return useMemo(() => {
		// Filter by search query (matches title)
		const normalizedQuery = searchQuery.toLowerCase().trim();
		const matchesSearch = normalizedQuery === '' || title.toLowerCase().includes(normalizedQuery);

		// Filter by tags (all selected tags must be present)
		const matchesTags =
			selectedTags.length === 0 ||
			(selectedTags.length > 0 && selectedTags.every(tag => tags.includes(tag)));

		return matchesSearch && matchesTags;
	}, [title, tags, searchQuery, selectedTags]);
}
