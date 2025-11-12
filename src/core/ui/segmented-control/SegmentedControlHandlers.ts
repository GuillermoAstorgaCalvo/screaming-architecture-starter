import type { SegmentedControlItem } from '@src-types/ui/navigation';
import type { KeyboardEvent } from 'react';

interface NavigationParams {
	readonly items: readonly SegmentedControlItem[];
	readonly itemIndex: number;
	readonly onValueChange: (itemId: string) => void;
}

export function handlePreviousItem({ items, itemIndex, onValueChange }: NavigationParams): void {
	const prevIndex = itemIndex > 0 ? itemIndex - 1 : items.length - 1;
	const prevItem = items[prevIndex];
	if (prevItem && !prevItem.disabled) {
		onValueChange(prevItem.id);
	}
}

export function handleNextItem({ items, itemIndex, onValueChange }: NavigationParams): void {
	const nextIndex = itemIndex < items.length - 1 ? itemIndex + 1 : 0;
	const nextItem = items[nextIndex];
	if (nextItem && !nextItem.disabled) {
		onValueChange(nextItem.id);
	}
}

export function handleFirstItem({
	items,
	onValueChange,
}: {
	readonly items: readonly SegmentedControlItem[];
	readonly onValueChange: (itemId: string) => void;
}): void {
	const [firstItem] = items;
	if (firstItem && !firstItem.disabled) {
		onValueChange(firstItem.id);
	}
}

export function handleLastItem({
	items,
	onValueChange,
}: {
	readonly items: readonly SegmentedControlItem[];
	readonly onValueChange: (itemId: string) => void;
}): void {
	const lastItem = items.at(-1);
	if (lastItem && !lastItem.disabled) {
		onValueChange(lastItem.id);
	}
}

interface HandleKeyDownParams {
	readonly event: KeyboardEvent<HTMLButtonElement>;
	readonly itemId: string;
	readonly items: readonly SegmentedControlItem[];
	readonly disabled: boolean;
	readonly onValueChange: (itemId: string) => void;
}

export function handleKeyDown({
	event,
	itemId,
	items,
	disabled,
	onValueChange,
}: HandleKeyDownParams): void {
	if (disabled) return;

	const itemIndex = items.findIndex(item => item.id === itemId);
	const navParams = { items, itemIndex, onValueChange };

	switch (event.key) {
		case 'ArrowLeft':
		case 'ArrowUp': {
			event.preventDefault();
			handlePreviousItem(navParams);
			break;
		}
		case 'ArrowRight':
		case 'ArrowDown': {
			event.preventDefault();
			handleNextItem(navParams);
			break;
		}
		case 'Home': {
			event.preventDefault();
			handleFirstItem({ items, onValueChange });
			break;
		}
		case 'End': {
			event.preventDefault();
			handleLastItem({ items, onValueChange });
			break;
		}
	}
}
