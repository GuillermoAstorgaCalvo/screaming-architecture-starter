import { resetDragState } from '@core/ui/utilities/sortable-list/helpers/useSortableList.drag.logic';
import { useDragEventHandlers } from '@core/ui/utilities/sortable-list/hooks/useSortableList.drag.compose';
import { useDragState } from '@core/ui/utilities/sortable-list/hooks/useSortableList.drag.state';
import type {
	UseDragHandlersParams,
	UseDragHandlersReturn,
} from '@core/ui/utilities/sortable-list/types/useSortableList.drag.types';
import { useCallback, useRef } from 'react';

/**
 * Main hook for managing drag-and-drop handlers in sortable lists
 *
 * Provides:
 * - Drag state management (dragged item ID, target index)
 * - Event handlers for drag start, end, over, and drop
 * - Automatic state reset on drop completion
 */
export function useDragHandlers<T>({
	items,
	onReorder,
	disabled,
}: UseDragHandlersParams<T>): UseDragHandlersReturn {
	const dragState = useDragState();
	const draggedIndexRef = useRef<number | null>(null);
	const resetState = useCallback(() => {
		resetDragState(dragState.setDraggedItemId, dragState.setDragTargetIndex, draggedIndexRef);
	}, [dragState.setDraggedItemId, dragState.setDragTargetIndex]);

	const { handleDragStart, handleDragEnd, handleDragOver, handleDrop } = useDragEventHandlers({
		disabled,
		dragState,
		draggedIndexRef,
		items,
		onReorder,
		resetState,
	});

	return {
		draggedItemId: dragState.draggedItemId,
		dragTargetIndex: dragState.dragTargetIndex,
		handleDragStart,
		handleDragEnd,
		handleDragOver,
		handleDrop,
	};
}
