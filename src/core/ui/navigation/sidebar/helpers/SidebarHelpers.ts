import {
	SIDEBAR_BASE_CLASSES,
	SIDEBAR_COLLAPSED_WIDTH,
	SIDEBAR_POSITION_CLASSES,
} from '@core/constants/ui/navigation';
import type { SidebarPosition } from '@src-types/ui/overlays/panels';

/**
 * Gets the width value for the sidebar
 */
export function getSidebarWidth(width: number | string, collapsed: boolean): number | string {
	if (collapsed) {
		return SIDEBAR_COLLAPSED_WIDTH;
	}
	return width;
}

/**
 * Gets the CSS classes for the sidebar
 */
export function getSidebarClasses(
	position: SidebarPosition,
	showBorder: boolean,
	className?: string
): string {
	const borderClass = showBorder
		? `${SIDEBAR_POSITION_CLASSES[position]} border-border dark:border-border`
		: '';
	return `${SIDEBAR_BASE_CLASSES} ${borderClass} ${className ?? ''}`.trim();
}
