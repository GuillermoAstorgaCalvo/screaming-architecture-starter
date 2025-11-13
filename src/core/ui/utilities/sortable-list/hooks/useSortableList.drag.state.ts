import type { UseDragStateReturn } from '@core/ui/utilities/sortable-list/types/useSortableList.drag.types';
import { useState } from 'react';

/**
 * Manages drag state (dragged item ID, target index)
 */
export function useDragState(): UseDragStateReturn {
	const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
	const [dragTargetIndex, setDragTargetIndex] = useState<number | null>(null);

	return {
		draggedItemId,
		dragTargetIndex,
		setDraggedItemId,
		setDragTargetIndex,
	};
}
