import type { SortableListItem } from '@src-types/ui/layout/list';
import type { DragEvent, KeyboardEvent } from 'react';

import { useDragHandlers } from './useSortableList.drag';
import { useKeyboardHandlers } from './useSortableList.keyboard';

interface UseSortableListParams<T> {
	items: readonly SortableListItem<T>[];
	onReorder: (items: readonly SortableListItem<T>[]) => void;
	disabled?: boolean | undefined;
}

export interface UseSortableListReturn {
	draggedItemId: string | null;
	dragTargetIndex: number | null;
	handleDragStart: (itemId: string, index: number) => void;
	handleDragEnd: () => void;
	handleDragOver: (e: DragEvent<HTMLLIElement>, index: number) => void;
	handleDrop: (e: DragEvent<HTMLLIElement>, targetIndex: number) => void;
	handleKeyDown: (e: KeyboardEvent<HTMLLIElement>, itemId: string, index: number) => void;
}

export function useSortableList<T>({
	items,
	onReorder,
	disabled = false,
}: UseSortableListParams<T>): UseSortableListReturn {
	const dragHandlers = useDragHandlers({
		items,
		onReorder,
		disabled,
	});

	const handleKeyDown = useKeyboardHandlers({
		items,
		onReorder,
		disabled,
	});

	return {
		...dragHandlers,
		handleKeyDown,
	};
}
