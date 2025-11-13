import { LIST_ITEM_SIZE_CLASSES } from '@core/constants/ui/display/list';
import {
	useSortableList,
	type UseSortableListReturn,
} from '@core/ui/utilities/sortable-list/hooks/useSortableList';
import type {
	ItemEventHandlers,
	UseSortableListConfig,
} from '@core/ui/utilities/sortable-list/types/SortableListTypes';
import type { StandardSize } from '@src-types/ui/base';
import { twMerge } from 'tailwind-merge';

/**
 * Get sortable list item classes
 */
export function getSortableListItemClasses({
	size,
	isDragging,
	isDragTarget,
	disabled,
	className,
}: {
	size: StandardSize;
	isDragging: boolean;
	isDragTarget: boolean;
	disabled: boolean;
	className?: string | undefined;
}): string {
	const cursorClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-move';
	const hoverClass = !disabled && !isDragging ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : '';

	const baseClasses = [
		LIST_ITEM_SIZE_CLASSES[size],
		'flex items-center gap-3 relative transition-all',
		cursorClass,
		isDragging ? 'opacity-50 scale-95' : '',
		isDragTarget ? 'ring-2 ring-primary ring-offset-2' : '',
		hoverClass,
	]
		.filter(Boolean)
		.join(' ');

	return twMerge(baseClasses, className);
}

/**
 * Get drag handle classes
 */
export function getDragHandleClasses({
	size,
	disabled,
	className,
}: {
	size: StandardSize;
	disabled: boolean;
	className?: string | undefined;
}): string {
	const cursorClass = disabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing';

	let sizeClass: string;
	if (size === 'sm') {
		sizeClass = 'w-4 h-4';
	} else if (size === 'md') {
		sizeClass = 'w-5 h-5';
	} else {
		sizeClass = 'w-6 h-6';
	}

	const baseClasses = ['shrink-0 text-gray-400 dark:text-gray-500', cursorClass, sizeClass]
		.filter(Boolean)
		.join(' ');

	return twMerge(baseClasses, className);
}

/**
 * Move item in array from one index to another
 */
export function moveItem<T>(array: readonly T[], fromIndex: number, toIndex: number): T[] {
	const newArray = [...array];
	const [removed] = newArray.splice(fromIndex, 1);
	if (removed === undefined) {
		return newArray;
	}
	newArray.splice(toIndex, 0, removed);
	return newArray;
}

/**
 * Prepares the sortable list configuration and handlers
 */
export function useSortableListConfig<T>({ items, onReorder, disabled }: UseSortableListConfig<T>) {
	return useSortableList({
		items,
		onReorder,
		disabled,
	});
}

/**
 * Prepares event handlers for sortable list items
 */
export function prepareItemHandlers(sortableListState: UseSortableListReturn): ItemEventHandlers {
	return {
		handleDragStart: sortableListState.handleDragStart,
		handleDragEnd: sortableListState.handleDragEnd,
		handleDragOver: sortableListState.handleDragOver,
		handleDrop: sortableListState.handleDrop,
		handleKeyDown: sortableListState.handleKeyDown,
	};
}
