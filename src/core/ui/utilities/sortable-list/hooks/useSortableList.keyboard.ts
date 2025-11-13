import { moveItem } from '@core/ui/utilities/sortable-list/helpers/SortableListHelpers';
import type { SortableListItem } from '@src-types/ui/layout/list';
import { type KeyboardEvent, useCallback, useMemo } from 'react';

interface UseKeyboardHandlersParams<T> {
	items: readonly SortableListItem<T>[];
	onReorder: (items: readonly SortableListItem<T>[]) => void;
	disabled: boolean;
}

/**
 * Focuses a sortable list item by its ID
 */
function focusItem(itemId: string): void {
	setTimeout(() => {
		const element = document.querySelector(`[data-sortable-item-id="${itemId}"]`);
		if (element instanceof HTMLElement) {
			element.focus();
		}
	}, 0);
}

/**
 * Calculates the new index when moving up or down
 */
function calculateArrowKeyIndex(
	key: string,
	currentIndex: number,
	totalItems: number
): number | null {
	if (key === 'ArrowUp' && currentIndex > 0) {
		return currentIndex - 1;
	}
	if (key === 'ArrowDown' && currentIndex < totalItems - 1) {
		return currentIndex + 1;
	}
	return null;
}

/**
 * Calculates the new index for Home key (move to start)
 */
function calculateHomeKeyIndex(currentIndex: number): number | null {
	return currentIndex > 0 ? 0 : null;
}

/**
 * Calculates the new index for End key (move to end)
 */
function calculateEndKeyIndex(currentIndex: number, totalItems: number): number | null {
	return currentIndex < totalItems - 1 ? totalItems - 1 : null;
}

/**
 * Reorders an item and focuses it
 */
function reorderAndFocus<T>({
	items,
	fromIndex,
	toIndex,
	itemId,
	onReorder,
}: {
	items: readonly SortableListItem<T>[];
	fromIndex: number;
	toIndex: number;
	itemId: string;
	onReorder: (items: readonly SortableListItem<T>[]) => void;
}): void {
	const reorderedItems = moveItem(items, fromIndex, toIndex);
	onReorder(reorderedItems);
	focusItem(itemId);
}

/**
 * Prevents default behavior and stops propagation
 */
function preventDefaultAndStopPropagation(e: KeyboardEvent<HTMLLIElement>): void {
	e.preventDefault();
	e.stopPropagation();
}

/**
 * Creates all keyboard handlers for sortable list
 */
function createHandlers<T>(
	items: readonly SortableListItem<T>[],
	onReorder: (items: readonly SortableListItem<T>[]) => void
) {
	const handleArrowKeys = (e: KeyboardEvent<HTMLLIElement>, itemId: string, index: number) => {
		preventDefaultAndStopPropagation(e);
		const newIndex = calculateArrowKeyIndex(e.key, index, items.length);
		if (newIndex !== null) {
			reorderAndFocus({ items, fromIndex: index, toIndex: newIndex, itemId, onReorder });
		}
	};

	const handleHomeKey = (e: KeyboardEvent<HTMLLIElement>, itemId: string, index: number) => {
		preventDefaultAndStopPropagation(e);
		const newIndex = calculateHomeKeyIndex(index);
		if (newIndex !== null) {
			reorderAndFocus({ items, fromIndex: index, toIndex: newIndex, itemId, onReorder });
		}
	};

	const handleEndKey = (e: KeyboardEvent<HTMLLIElement>, itemId: string, index: number) => {
		preventDefaultAndStopPropagation(e);
		const newIndex = calculateEndKeyIndex(index, items.length);
		if (newIndex !== null) {
			reorderAndFocus({ items, fromIndex: index, toIndex: newIndex, itemId, onReorder });
		}
	};

	return { handleArrowKeys, handleHomeKey, handleEndKey };
}

export function useKeyboardHandlers<T>({
	items,
	onReorder,
	disabled,
}: UseKeyboardHandlersParams<T>) {
	const { handleArrowKeys, handleHomeKey, handleEndKey } = useMemo(
		() => createHandlers(items, onReorder),
		[items, onReorder]
	);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLLIElement>, itemId: string, index: number) => {
			if (disabled) return;
			switch (e.key) {
				case 'ArrowUp':
				case 'ArrowDown': {
					handleArrowKeys(e, itemId, index);
					break;
				}
				case 'Home': {
					handleHomeKey(e, itemId, index);
					break;
				}
				case 'End': {
					handleEndKey(e, itemId, index);
					break;
				}
			}
		},
		[disabled, handleArrowKeys, handleHomeKey, handleEndKey]
	);

	return handleKeyDown;
}
