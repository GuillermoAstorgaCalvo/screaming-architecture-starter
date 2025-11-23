export interface ComponentSearchBarProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	selectedTags: readonly string[];
	onTagToggle: (tag: string) => void;
	availableTags: readonly string[];
}

export interface TagToggleButtonProps {
	tag: string;
	isSelected: boolean;
	onToggle: () => void;
}

export interface TagExpansionControlsProps {
	hasMoreTags: boolean;
	showAllTags: boolean;
	onShowMore: () => void;
	onShowLess: () => void;
	hiddenTagsCount: number;
}

export interface TagFilterSectionProps {
	availableTags: readonly string[];
	selectedTags: readonly string[];
	onTagToggle: (tag: string) => void;
}

export interface TagListProps {
	visibleTags: readonly string[];
	selectedTags: readonly string[];
	onTagToggle: (tag: string) => void;
	hasMoreTags: boolean;
	showAllTags: boolean;
	onShowMore: () => void;
	onShowLess: () => void;
	hiddenTagsCount: number;
}

export interface SelectedTagsCountProps {
	count: number;
}
