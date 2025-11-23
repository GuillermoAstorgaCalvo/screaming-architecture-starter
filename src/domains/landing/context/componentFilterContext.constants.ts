import { createContext } from 'react';

export interface ComponentFilterContextValue {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	selectedTags: readonly string[];
	toggleTag: (tag: string) => void;
	clearFilters: () => void;
}

export const ComponentFilterContext = createContext<ComponentFilterContextValue | undefined>(
	undefined
);
