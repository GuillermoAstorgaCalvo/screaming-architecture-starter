import type { SortableListItem as SortableListItemType } from '@src-types/ui/layout/list';
import type { DragEvent, KeyboardEvent, ReactNode } from 'react';

/**
 * Drag state for a sortable list item
 */
export interface ItemDragState {
	isDragging: boolean;
	isDragTarget: boolean;
}

/**
 * Parameters for determining item drag state
 */
export interface GetItemDragStateParams<T> {
	item: SortableListItemType<T>;
	index: number;
	draggedItemId: string | null;
	dragTargetIndex: number | null;
}

/**
 * Event handlers for sortable list items
 */
export interface ItemEventHandlers {
	handleDragStart: (itemId: string, index: number) => void;
	handleDragEnd: () => void;
	handleDragOver: (e: DragEvent<HTMLLIElement>, index: number) => void;
	handleDrop: (e: DragEvent<HTMLLIElement>, index: number) => void;
	handleKeyDown: (e: KeyboardEvent<HTMLLIElement>, itemId: string, index: number) => void;
}

/**
 * Parameters for rendering a single sortable item
 */
export interface RenderItemParams<T> {
	item: SortableListItemType<T>;
	index: number;
	items: readonly SortableListItemType<T>[];
	draggedItemId: string | null;
	dragTargetIndex: number | null;
	showDragHandle: boolean;
	dragHandle?: ReactNode;
	disabled: boolean;
	handlers: ItemEventHandlers;
	renderItem: (item: SortableListItemType<T>, index: number) => ReactNode;
}

/**
 * Parameters for rendering all sortable items
 */
export interface RenderItemsParams<T> {
	items: readonly SortableListItemType<T>[];
	draggedItemId: string | null;
	dragTargetIndex: number | null;
	showDragHandle: boolean;
	dragHandle?: ReactNode;
	disabled: boolean;
	handlers: ItemEventHandlers;
	renderItem: (item: SortableListItemType<T>, index: number) => ReactNode;
}

/**
 * Configuration for useSortableList hook
 */
export interface UseSortableListConfig<T> {
	items: readonly SortableListItemType<T>[];
	onReorder: (items: readonly SortableListItemType<T>[]) => void;
	disabled: boolean;
}
