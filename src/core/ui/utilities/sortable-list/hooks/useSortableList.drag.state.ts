import { useState } from 'react';

import type { UseDragStateReturn } from './useSortableList.drag.types';

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
