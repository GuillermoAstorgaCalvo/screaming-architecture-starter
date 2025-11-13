import {
	TAB_BUTTON_BASE_CLASSES,
	TAB_BUTTON_SIZE_CLASSES,
	TAB_BUTTON_VARIANT_CLASSES,
	TABS_BASE_CLASSES,
	TABS_VARIANT_CLASSES,
} from '@core/constants/ui/navigation';
import type { StandardSize } from '@src-types/ui/base';
import type { TabsVariant } from '@src-types/ui/navigation/tabs';
import { twMerge } from 'tailwind-merge';

export interface TabButtonClassOptions {
	readonly variant: TabsVariant;
	readonly size: StandardSize;
	readonly isActive: boolean;
	readonly fullWidth: boolean;
}

/**
 * Gets the CSS classes for the tabs container
 */
export function getTabsClasses(
	variant: TabsVariant,
	fullWidth: boolean,
	className?: string
): string {
	const variantClasses = TABS_VARIANT_CLASSES[variant];
	const widthClass = fullWidth ? 'w-full' : '';
	return twMerge(TABS_BASE_CLASSES, variantClasses, widthClass, className);
}

/**
 * Gets the CSS classes for a tab button
 */
export function getTabButtonClasses(options: TabButtonClassOptions): string {
	const { variant, size, isActive, fullWidth } = options;
	const sizeClasses = TAB_BUTTON_SIZE_CLASSES[size];
	const variantClasses = TAB_BUTTON_VARIANT_CLASSES[variant];
	const stateClasses = isActive ? variantClasses.active : variantClasses.inactive;
	const widthClass = fullWidth ? 'flex-1' : '';
	const roundedClass = variant === 'pills' ? 'rounded-md' : '';

	return twMerge(TAB_BUTTON_BASE_CLASSES, sizeClasses, stateClasses, widthClass, roundedClass);
}

/**
 * Generates unique IDs for tab and panel elements
 */
export function getTabIds(
	id: string,
	itemId: string
): {
	readonly tabId: string;
	readonly panelId: string;
} {
	return {
		tabId: `${id}-tab-${itemId}`,
		panelId: `${id}-panel-${itemId}`,
	};
}
