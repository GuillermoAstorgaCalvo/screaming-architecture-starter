import { moveItem } from '@core/ui/utilities/sortable-list/helpers/SortableListHelpers';
import type { SortableListItem } from '@src-types/ui/layout/list';

/**
 * Resets all drag state to initial values
 */
export function resetDragState(
	setDraggedItemId: (id: string | null) => void,
	setDragTargetIndex: (index: number | null) => void,
	draggedIndexRef: { current: number | null }
): void {
	setDraggedItemId(null);
	setDragTargetIndex(null);
	draggedIndexRef.current = null;
}

/**
 * Checks if drag operation is valid
 */
export function isValidDragOperation(
	disabled: boolean,
	draggedItemId: string | null,
	draggedIndex: number | null
): boolean {
	return !disabled && draggedItemId !== null && draggedIndex !== null;
}

interface DragStartParams {
	disabled: boolean;
	setDraggedItemId: (id: string | null) => void;
	draggedIndexRef: { current: number | null };
	itemId: string;
	index: number;
}

/**
 * Creates drag start handler logic
 */
export function createDragStartLogic({
	disabled,
	setDraggedItemId,
	draggedIndexRef,
	itemId,
	index,
}: DragStartParams): void {
	if (disabled) {
		return;
	}
	setDraggedItemId(itemId);
	draggedIndexRef.current = index;
}

interface DragOverParams {
	disabled: boolean;
	draggedItemId: string | null;
	draggedIndex: number | null;
	setDragTargetIndex: (index: number | null) => void;
	index: number;
}

/**
 * Creates drag over handler logic
 */
export function createDragOverLogic({
	disabled,
	draggedItemId,
	draggedIndex,
	setDragTargetIndex,
	index,
}: DragOverParams): void {
	if (!isValidDragOperation(disabled, draggedItemId, draggedIndex)) {
		return;
	}

	if (draggedIndex === index) {
		setDragTargetIndex(null);
	} else {
		setDragTargetIndex(index);
	}
}

interface DropParams<T> {
	disabled: boolean;
	draggedItemId: string | null;
	draggedIndex: number | null;
	items: readonly SortableListItem<T>[];
	onReorder: (items: readonly SortableListItem<T>[]) => void;
	targetIndex: number;
	resetState: () => void;
}

/**
 * Creates drop handler logic
 */
export function createDropLogic<T>({
	disabled,
	draggedItemId,
	draggedIndex,
	items,
	onReorder,
	targetIndex,
	resetState,
}: DropParams<T>): void {
	if (!isValidDragOperation(disabled, draggedItemId, draggedIndex)) {
		return;
	}

	if (draggedIndex !== null && draggedIndex !== targetIndex) {
		const reorderedItems = moveItem(items, draggedIndex, targetIndex);
		onReorder(reorderedItems);
	}

	resetState();
}
