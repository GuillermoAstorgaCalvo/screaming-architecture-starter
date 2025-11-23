import Text from '@core/ui/text/Text';
import { MAX_VISIBLE_TAGS } from '@domains/landing/components/shared/ComponentSearchBar.constants';
import type { TagFilterSectionProps } from '@domains/landing/components/shared/ComponentSearchBar.types';
import { useMemo, useState } from 'react';

import { SelectedTagsCount } from './SelectedTagsCount';
import { TagList } from './TagList';

export function TagFilterSection({
	availableTags,
	selectedTags,
	onTagToggle,
}: Readonly<TagFilterSectionProps>) {
	const [showAllTags, setShowAllTags] = useState(false);

	const visibleTags = useMemo(() => {
		if (showAllTags) {
			return availableTags;
		}
		return availableTags.slice(0, MAX_VISIBLE_TAGS);
	}, [availableTags, showAllTags]);

	const hasMoreTags = availableTags.length > MAX_VISIBLE_TAGS;
	const hiddenTagsCount = availableTags.length - MAX_VISIBLE_TAGS;

	if (availableTags.length === 0) {
		return null;
	}

	return (
		<div className="space-y-3">
			<Text size="lg" className="font-semibold text-white/90 mb-1">
				Filter by tags:
			</Text>
			<TagList
				visibleTags={visibleTags}
				selectedTags={selectedTags}
				onTagToggle={onTagToggle}
				hasMoreTags={hasMoreTags}
				showAllTags={showAllTags}
				onShowMore={() => setShowAllTags(true)}
				onShowLess={() => setShowAllTags(false)}
				hiddenTagsCount={hiddenTagsCount}
			/>
			<SelectedTagsCount count={selectedTags.length} />
		</div>
	);
}
