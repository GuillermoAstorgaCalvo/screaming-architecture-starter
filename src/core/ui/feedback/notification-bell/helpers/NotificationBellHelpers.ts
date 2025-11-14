import type { StandardSize } from '@src-types/ui/base';
import { twMerge } from 'tailwind-merge';

const ICON_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'h-4 w-4',
	md: 'h-5 w-5',
	lg: 'h-6 w-6',
} as const;

/**
 * Gets the Tailwind CSS classes for the icon size based on the standard size variant.
 *
 * @param size - The standard size variant (sm, md, lg)
 * @returns The Tailwind CSS classes for the icon size
 */
export function getIconSizeClasses(size: StandardSize): string {
	return ICON_SIZE_CLASSES[size];
}

/**
 * Formats the notification count for display.
 * Shows max count with "+" suffix when count exceeds maxCount.
 *
 * @param count - The actual notification count
 * @param maxCount - The maximum count to display before showing "+"
 * @returns The formatted count string (e.g., "5", "99+")
 */
export function getDisplayCount(count: number, maxCount: number): string {
	return count > maxCount ? `${maxCount}+` : count.toString();
}

/**
 * Gets the Tailwind CSS classes for the notification bell button.
 *
 * @param animated - Whether the button should have animation
 * @param showBadge - Whether the badge is visible
 * @param className - Optional additional className
 * @returns The merged Tailwind CSS classes for the button
 */
export function getButtonClasses(
	animated: boolean,
	showBadge: boolean,
	className?: string
): string {
	return twMerge(
		'relative inline-flex items-center justify-center',
		'rounded-md transition-colors',
		'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
		'hover:bg-muted dark:hover:bg-muted',
		'disabled:opacity-disabled disabled:cursor-not-allowed',
		animated && showBadge && 'animate-pulse',
		className
	);
}
