/**
 * Divider and separator display constants
 */
import type { DividerOrientation, SeparatorOrientation } from '@src-types/ui/layout/divider';

export const DIVIDER_BASE_CLASSES = 'border-gray-300 dark:border-gray-600';

export const DIVIDER_ORIENTATION_CLASSES: Record<DividerOrientation, string> = {
	horizontal: 'w-full border-t',
	vertical: 'h-full border-l',
} as const;

export const SEPARATOR_BASE_CLASSES = 'border-gray-200 dark:border-gray-500';

export const SEPARATOR_ORIENTATION_CLASSES: Record<SeparatorOrientation, string> = {
	horizontal: 'w-full border-t',
	vertical: 'h-full border-l',
} as const;
