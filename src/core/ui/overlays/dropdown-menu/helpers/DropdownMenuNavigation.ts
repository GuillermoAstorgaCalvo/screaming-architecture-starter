import type {
	DropdownMenuItem,
	DropdownMenuItemOrSeparator,
} from '@core/ui/overlays/dropdown-menu/types/DropdownMenu.types';
import type { KeyboardEvent } from 'react';

function isSeparator(
	item: DropdownMenuItemOrSeparator | undefined
): item is { readonly id: string; readonly type: 'separator' } {
	return item !== undefined && 'type' in item;
}

function isEnabledItem(item: DropdownMenuItemOrSeparator | undefined): item is DropdownMenuItem {
	return item !== undefined && !isSeparator(item) && !item.disabled;
}

export function findNextEnabledIndex(
	items: DropdownMenuItemOrSeparator[],
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

interface HandleArrowKeyNavigationParams {
	readonly event: KeyboardEvent<HTMLDivElement>;
	readonly items: DropdownMenuItemOrSeparator[];
	readonly highlightedIndex: number;
	readonly setHighlightedIndex: (index: number) => void;
}

export function handleArrowKeyNavigation({
	event,
	items,
	highlightedIndex,
	setHighlightedIndex,
}: HandleArrowKeyNavigationParams): void {
	event.preventDefault();
	const direction = event.key === 'ArrowDown' ? 1 : -1;
	const nextIndex = findNextEnabledIndex(items, highlightedIndex, direction);
	if (nextIndex >= 0) {
		setHighlightedIndex(nextIndex);
	}
}

export function handleHomeKey(
	event: KeyboardEvent<HTMLDivElement>,
	items: DropdownMenuItemOrSeparator[],
	setHighlightedIndex: (index: number) => void
): void {
	event.preventDefault();
	const firstEnabled = findNextEnabledIndex(items, -1, 1);
	if (firstEnabled >= 0) {
		setHighlightedIndex(firstEnabled);
	}
}

export function handleEndKey(
	event: KeyboardEvent<HTMLDivElement>,
	items: DropdownMenuItemOrSeparator[],
	setHighlightedIndex: (index: number) => void
): void {
	event.preventDefault();
	const lastEnabled = findNextEnabledIndex(items, 0, -1);
	if (lastEnabled >= 0) {
		setHighlightedIndex(lastEnabled);
	}
}

export function handleEscapeKey(
	event: KeyboardEvent<HTMLDivElement>,
	setOpen: (open: boolean) => void
): void {
	event.preventDefault();
	setOpen(false);
}

interface HandleEnterOrSpaceParams {
	readonly event: KeyboardEvent<HTMLDivElement>;
	readonly items: DropdownMenuItemOrSeparator[];
	readonly highlightedIndex: number;
	readonly handleSelect: (item: DropdownMenuItem) => Promise<undefined>;
}

export function handleEnterOrSpace({
	event,
	items,
	highlightedIndex,
	handleSelect,
}: HandleEnterOrSpaceParams): void {
	event.preventDefault();
	const item = items[highlightedIndex];
	if (isEnabledItem(item)) {
		handleSelect(item).catch(() => {
			// Ignore errors from async select handler
		});
	}
}
