import type { KeyboardEvent } from 'react';

import type { ContextMenuItem, ContextMenuItemOrSeparator, ContextMenuProps } from './ContextMenu';

export function isSeparator(
	item: ContextMenuItemOrSeparator | undefined
): item is { readonly id: string; readonly type: 'separator' } {
	return item !== undefined && 'type' in item;
}

function isEnabledItem(item: ContextMenuItemOrSeparator | undefined): item is ContextMenuItem {
	return item !== undefined && !isSeparator(item) && !item.disabled;
}

export function findNextEnabledIndex(
	items: ContextMenuItemOrSeparator[],
	startIndex: number,
	direction: 1 | -1
): number {
	let index = startIndex;
	const total = items.length;

	for (let i = 0; i < total; i += 1) {
		index = (index + direction + total) % total;
		if (isEnabledItem(items[index])) {
			return index;
		}
	}

	return -1;
}

export function handleArrowKeyNavigation({
	event,
	items,
	highlightedIndex,
	setHighlightedIndex,
}: {
	readonly event: KeyboardEvent<HTMLDivElement>;
	readonly items: ContextMenuItemOrSeparator[];
	readonly highlightedIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
}): void {
	event.preventDefault();
	const direction = event.key === 'ArrowDown' ? 1 : -1;
	const nextIndex = findNextEnabledIndex(items, highlightedIndex, direction);
	if (nextIndex >= 0) {
		setHighlightedIndex(nextIndex);
	}
}

export function handleEscapeKey(
	event: KeyboardEvent<HTMLDivElement>,
	setOpen: (open: boolean) => void
): void {
	event.preventDefault();
	setOpen(false);
}

export function handleEnterOrSpace({
	event,
	items,
	highlightedIndex,
	handleSelect,
}: {
	readonly event: KeyboardEvent<HTMLDivElement>;
	readonly items: ContextMenuItemOrSeparator[];
	readonly highlightedIndex: number;
	readonly handleSelect: (item: ContextMenuItem) => Promise<undefined>;
}): void {
	event.preventDefault();
	const item = items[highlightedIndex];
	if (isSeparator(item)) {
		return;
	}
	if (isEnabledItem(item)) {
		handleSelect(item).catch(() => {
			// Ignore errors from async select handler
		});
	}
}

const POSITION_MAP: Record<'start' | 'center' | 'end', 'bottom-start' | 'bottom' | 'bottom-end'> = {
	start: 'bottom-start',
	center: 'bottom',
	end: 'bottom-end',
};

export function getContextMenuPosition(align: ContextMenuProps['align'] = 'center') {
	return POSITION_MAP[align];
}
