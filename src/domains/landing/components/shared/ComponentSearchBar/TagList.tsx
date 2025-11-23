import Flex from '@core/ui/layout/flex/Flex';
import type { TagListProps } from '@domains/landing/components/shared/ComponentSearchBar.types';

import { TagExpansionControls } from './TagExpansionControls';
import { TagToggleButton } from './TagToggleButton';

export function TagList({
	visibleTags,
	selectedTags,
	onTagToggle,
	hasMoreTags,
	showAllTags,
	onShowMore,
	onShowLess,
	hiddenTagsCount,
}: Readonly<TagListProps>) {
	return (
		<Flex gap="md" wrap className="flex-wrap gap-3">
			{visibleTags.map(tag => (
				<TagToggleButton
					key={tag}
					tag={tag}
					isSelected={selectedTags.includes(tag)}
					onToggle={() => onTagToggle(tag)}
				/>
			))}
			<TagExpansionControls
				hasMoreTags={hasMoreTags}
				showAllTags={showAllTags}
				onShowMore={onShowMore}
				onShowLess={onShowLess}
				hiddenTagsCount={hiddenTagsCount}
			/>
		</Flex>
	);
}
