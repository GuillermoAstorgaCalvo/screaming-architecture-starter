import { useMemo } from 'react';

export interface ComponentFilterOptions {
	searchQuery: string;
	selectedTags: readonly string[];
}

export interface ComponentMetadata {
	title: string;
	tags?: readonly string[];
}

/**
 * Checks if a component matches the search query
 */
function matchesSearchQuery(component: ComponentMetadata, normalizedQuery: string): boolean {
	return normalizedQuery === '' || component.title.toLowerCase().includes(normalizedQuery);
}

/**
 * Checks if a component matches all selected tags
 */
function matchesSelectedTags(
	component: ComponentMetadata,
	selectedTags: readonly string[]
): boolean {
	if (selectedTags.length === 0) {
		return true;
	}

	if (!component.tags) {
		return false;
	}

	// Check if all selected tags are present in component tags
	for (const tag of selectedTags) {
		if (!component.tags.includes(tag)) {
			return false;
		}
	}

	return true;
}

/**
 * Filters components based on search query and tags
 */
function filterComponents(
	components: readonly ComponentMetadata[],
	normalizedQuery: string,
	selectedTags: readonly string[]
): ComponentMetadata[] {
	return components.filter(component => {
		if (!matchesSearchQuery(component, normalizedQuery)) {
			return false;
		}

		return matchesSelectedTags(component, selectedTags);
	});
}

/**
 * Extracts all unique tags from components and returns them sorted
 */
function extractAllTags(components: readonly ComponentMetadata[]): string[] {
	const tagSet = new Set<string>();
	for (const component of components) {
		if (component.tags) {
			for (const tag of component.tags) {
				tagSet.add(tag);
			}
		}
	}
	return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}

/**
 * Hook to filter components based on search query and tags
 */
export function useComponentFilter(
	components: readonly ComponentMetadata[],
	{ searchQuery, selectedTags }: ComponentFilterOptions
) {
	const normalizedQuery = searchQuery.toLowerCase().trim();

	const filteredComponents = useMemo(
		() => filterComponents(components, normalizedQuery, selectedTags),
		[components, normalizedQuery, selectedTags]
	);

	const allAvailableTags = useMemo(() => extractAllTags(components), [components]);

	return {
		filteredComponents,
		allAvailableTags,
	};
}
