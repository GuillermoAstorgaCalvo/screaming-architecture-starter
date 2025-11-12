import type { SortableListItem } from '@src-types/ui/layout/list';
import type { DragEvent } from 'react';

export interface UseDragHandlersParams<T> {
	items: readonly SortableListItem<T>[];
	onReorder: (items: readonly SortableListItem<T>[]) => void;
	disabled: boolean;
}

export interface UseDragHandlersReturn {
	draggedItemId: string | null;
	dragTargetIndex: number | null;
	handleDragStart: (itemId: string, index: number) => void;
	handleDragEnd: () => void;
	handleDragOver: (e: DragEvent<HTMLLIElement>, index: number) => void;
	handleDrop: (e: DragEvent<HTMLLIElement>, targetIndex: number) => void;
}

export interface UseDragStateReturn {
	draggedItemId: string | null;
	dragTargetIndex: number | null;
	setDraggedItemId: (id: string | null) => void;
	setDragTargetIndex: (index: number | null) => void;
}

export interface UseDragStartHandlerParams {
	disabled: boolean;
	setDraggedItemId: (id: string | null) => void;
	draggedIndexRef: { current: number | null };
}

export interface UseDragOverHandlerParams {
	disabled: boolean;
	draggedItemId: string | null;
	setDragTargetIndex: (index: number | null) => void;
	draggedIndexRef: { current: number | null };
}

export interface UseDropHandlerParams<T> {
	disabled: boolean;
	draggedItemId: string | null;
	items: readonly SortableListItem<T>[];
	onReorder: (items: readonly SortableListItem<T>[]) => void;
	resetState: () => void;
	draggedIndexRef: { current: number | null };
}

export interface DragEventHandlersParams<T> {
	disabled: boolean;
	dragState: UseDragStateReturn;
	draggedIndexRef: { current: number | null };
	items: readonly SortableListItem<T>[];
	onReorder: (items: readonly SortableListItem<T>[]) => void;
	resetState: () => void;
}
