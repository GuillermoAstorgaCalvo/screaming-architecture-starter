import {
	useDragEndHandler,
	useDragOverHandler,
	useDragStartHandler,
	useDropHandler,
} from './useSortableList.drag.handlers';
import type { DragEventHandlersParams, UseDragHandlersReturn } from './useSortableList.drag.types';

/**
 * Creates drag event handlers
 */
export function useDragEventHandlers<T>({
	disabled,
	dragState,
	draggedIndexRef,
	items,
	onReorder,
	resetState,
}: DragEventHandlersParams<T>): Pick<
	UseDragHandlersReturn,
	'handleDragStart' | 'handleDragEnd' | 'handleDragOver' | 'handleDrop'
> {
	const handleDragStart = useDragStartHandler({
		disabled,
		setDraggedItemId: dragState.setDraggedItemId,
		draggedIndexRef,
	});

	const handleDragEnd = useDragEndHandler(resetState);

	const handleDragOver = useDragOverHandler({
		disabled,
		draggedItemId: dragState.draggedItemId,
		setDragTargetIndex: dragState.setDragTargetIndex,
		draggedIndexRef,
	});

	const handleDrop = useDropHandler({
		disabled,
		draggedItemId: dragState.draggedItemId,
		items,
		onReorder,
		resetState,
		draggedIndexRef,
	});

	return { handleDragStart, handleDragEnd, handleDragOver, handleDrop };
}
