import { renderFocusTrapShowcase } from './render-focus-trap';
import { renderResizableShowcase } from './render-resizable';
import { renderSortableListShowcase } from './render-sortable-list';
import { renderSplitterShowcase } from './render-splitter';
import { renderSwipeableShowcase } from './render-swipeable';
import type { InteractionShowcaseProps } from './types/types';

export function InteractionShowcase({
	focusTrapEnabled,
	setFocusTrapEnabled,
	sortableItems,
	setSortableItems,
}: Readonly<InteractionShowcaseProps>) {
	return (
		<div className="space-y-8">
			{renderFocusTrapShowcase({ focusTrapEnabled, setFocusTrapEnabled })}
			{renderResizableShowcase()}
			{renderSortableListShowcase({ sortableItems, setSortableItems })}
			{renderSplitterShowcase()}
			{renderSwipeableShowcase()}
		</div>
	);
}
