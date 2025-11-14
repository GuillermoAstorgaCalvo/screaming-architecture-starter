/**
 * Divider and separator display constants
 * Uses design tokens for colors
 */
import type { DividerOrientation, SeparatorOrientation } from '@src-types/ui/layout/divider';

export const DIVIDER_BASE_CLASSES = 'border-border dark:border-border-dark';

export const DIVIDER_ORIENTATION_CLASSES: Record<DividerOrientation, string> = {
	horizontal: 'w-full border-t',
	vertical: 'h-full border-l',
} as const;

export const SEPARATOR_BASE_CLASSES = 'border-border dark:border-border-dark';

export const SEPARATOR_ORIENTATION_CLASSES: Record<SeparatorOrientation, string> = {
	horizontal: 'w-full border-t',
	vertical: 'h-full border-l',
} as const;
