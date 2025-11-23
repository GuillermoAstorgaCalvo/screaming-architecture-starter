import SearchInput from '@core/ui/forms/search-input/SearchInput';

import type { ComponentSearchBarProps } from './ComponentSearchBar.types';
import { TagFilterSection } from './ComponentSearchBar/TagFilterSection';

/**
 * ComponentSearchBar - Search and filter bar for component library
 */
export default function ComponentSearchBar({
	searchQuery,
	onSearchChange,
	selectedTags,
	onTagToggle,
	availableTags,
}: Readonly<ComponentSearchBarProps>) {
	return (
		<div className="space-y-6">
			<div>
				<SearchInput
					placeholder="Search components by name..."
					value={searchQuery}
					onChange={onSearchChange}
					fullWidth
					size="md"
					className="glass-sm border-white/20 focus-within:border-primary/50"
				/>
			</div>
			<TagFilterSection
				availableTags={availableTags}
				selectedTags={selectedTags}
				onTagToggle={onTagToggle}
			/>
		</div>
	);
}
