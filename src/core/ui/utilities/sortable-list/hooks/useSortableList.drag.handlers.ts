import {
	createDragOverLogic,
	createDragStartLogic,
	createDropLogic,
} from '@core/ui/utilities/sortable-list/helpers/useSortableList.drag.logic';
import type {
	UseDragOverHandlerParams,
	UseDragStartHandlerParams,
	UseDropHandlerParams,
} from '@core/ui/utilities/sortable-list/types/useSortableList.drag.types';
import { type DragEvent, useCallback } from 'react';

/**
 * Creates drag start handler
 */
export function useDragStartHandler({
	disabled,
	setDraggedItemId,
	draggedIndexRef,
}: UseDragStartHandlerParams) {
	return useCallback(
		(itemId: string, index: number) => {
			createDragStartLogic({
				disabled,
				setDraggedItemId,
				draggedIndexRef,
				itemId,
				index,
			});
		},
		[disabled, setDraggedItemId, draggedIndexRef]
	);
}

/**
 * Creates drag end handler
 */
export function useDragEndHandler(resetState: () => void) {
	return useCallback(() => resetState(), [resetState]);
}

/**
 * Creates drag over handler
 */
export function useDragOverHandler({
	disabled,
	draggedItemId,
	setDragTargetIndex,
	draggedIndexRef,
}: UseDragOverHandlerParams) {
	return useCallback(
		(e: DragEvent<HTMLLIElement>, index: number) => {
			e.preventDefault();
			e.stopPropagation();
			createDragOverLogic({
				disabled,
				draggedItemId,
				draggedIndex: draggedIndexRef.current,
				setDragTargetIndex,
				index,
			});
		},
		[disabled, draggedItemId, setDragTargetIndex, draggedIndexRef]
	);
}

/**
 * Creates drop handler
 */
export function useDropHandler<T>({
	disabled,
	draggedItemId,
	items,
	onReorder,
	resetState,
	draggedIndexRef,
}: UseDropHandlerParams<T>) {
	return useCallback(
		(e: DragEvent<HTMLLIElement>, targetIndex: number) => {
			e.preventDefault();
			e.stopPropagation();
			createDropLogic({
				disabled,
				draggedItemId,
				draggedIndex: draggedIndexRef.current,
				items,
				onReorder,
				targetIndex,
				resetState,
			});
		},
		[disabled, draggedItemId, items, onReorder, resetState, draggedIndexRef]
	);
}
