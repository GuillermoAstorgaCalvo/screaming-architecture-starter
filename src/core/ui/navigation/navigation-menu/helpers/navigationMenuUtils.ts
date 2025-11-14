import type { NavigationMenuItem } from '@src-types/ui/navigation/navigationMenu';
import type { KeyboardEvent } from 'react';

export function findNextEnabledItemIndex(
	items: readonly NavigationMenuItem[],
	startIndex: number,
	direction: 1 | -1
): number {
	let index = startIndex;
	const total = items.length;

	for (let i = 0; i < total; i += 1) {
		index = (index + direction + total) % total;
		if (!items[index]?.disabled) {
			return index;
		}
	}

	return -1;
}

export function getMenuContainerProps(
	orientation: 'horizontal' | 'vertical',
	classes: string,
	handleKeyDown: (event: KeyboardEvent<HTMLElement>) => void
) {
	return {
		role: 'menu' as const,
		className: classes,
		onKeyDown: handleKeyDown,
		tabIndex: 0,
		'aria-orientation': orientation,
	};
}
