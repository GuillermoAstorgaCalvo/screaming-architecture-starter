import { useComponentFilterContext } from '@domains/landing/hooks/useComponentFilterContext';
import { ALL_AVAILABLE_TAGS } from '@domains/landing/pages/landing.constants';
import { useMemo } from 'react';

export function useLandingPageFilters() {
	const { searchQuery, setSearchQuery, selectedTags, toggleTag } = useComponentFilterContext();

	const allAvailableTags = useMemo(() => {
		return [...ALL_AVAILABLE_TAGS].sort((a, b) => a.localeCompare(b));
	}, []);

	return {
		searchQuery,
		setSearchQuery,
		selectedTags,
		toggleTag,
		allAvailableTags,
	};
}
