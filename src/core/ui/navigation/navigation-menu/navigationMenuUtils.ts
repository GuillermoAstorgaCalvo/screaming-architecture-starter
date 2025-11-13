import type { NavigationMenuItem } from '@src-types/ui/navigation/navigationMenu';

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
