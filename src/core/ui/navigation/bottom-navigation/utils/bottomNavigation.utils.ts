import {
	BOTTOM_NAV_ITEM_ACTIVE_CLASSES,
	BOTTOM_NAV_ITEM_BASE_CLASSES,
	BOTTOM_NAV_ITEM_INACTIVE_CLASSES,
	BOTTOM_NAV_ITEM_SIZE_CLASSES,
} from '@core/ui/navigation/bottom-navigation/constants/bottomNavigation.constants';
import type { BottomNavigationItem } from '@src-types/ui/navigation/bottomNavigation';
import { twMerge } from 'tailwind-merge';

/**
 * Handles item click event
 */
export function handleItemClick(
	item: BottomNavigationItem,
	onItemChange: (itemId: string) => void
): void {
	if (!item.disabled) {
		onItemChange(item.id);
	}
}

/**
 * Computes CSS classes for a navigation item
 */
export function getItemClasses(isActive: boolean, size: 'sm' | 'md' | 'lg'): string {
	const itemSizeClasses = BOTTOM_NAV_ITEM_SIZE_CLASSES[size];
	const stateClasses = isActive ? BOTTOM_NAV_ITEM_ACTIVE_CLASSES : BOTTOM_NAV_ITEM_INACTIVE_CLASSES;

	return twMerge(BOTTOM_NAV_ITEM_BASE_CLASSES, itemSizeClasses, stateClasses);
}
