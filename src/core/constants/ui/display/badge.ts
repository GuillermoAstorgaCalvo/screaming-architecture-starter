/**
 * Badge and Chip display constants
 * Uses design tokens for colors, spacing, and shadows
 */
import type { StandardSize } from '@src-types/ui/base';
import type { BadgeVariant } from '@src-types/ui/feedback';

export const BADGE_BASE_CLASSES =
	'inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

export const BADGE_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-xs py-xs text-xs',
	md: 'px-sm py-xs text-sm',
	lg: 'px-md py-sm text-base',
} as const;

export const BADGE_VARIANT_CLASSES: Record<BadgeVariant, string> = {
	default:
		'bg-muted text-text-primary focus:ring-border dark:bg-muted-dark dark:text-text-primary-dark',
	primary:
		'bg-primary text-primary-foreground focus:ring-primary dark:bg-primary dark:text-primary-foreground',
	success:
		'bg-success-light text-success-dark focus:ring-success dark:bg-success-dark dark:text-success-light',
	warning:
		'bg-warning-light text-warning-dark focus:ring-warning dark:bg-warning-dark dark:text-warning-light',
	error:
		'bg-destructive-light text-destructive-dark focus:ring-destructive dark:bg-destructive-dark dark:text-destructive-light',
	info: 'bg-info-light text-info-dark focus:ring-info dark:bg-info-dark dark:text-info-light',
} as const;

export const CHIP_BASE_CLASSES =
	'inline-flex items-center gap-xs rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

export const CHIP_SIZE_CLASSES: Record<StandardSize, string> = BADGE_SIZE_CLASSES;

export const CHIP_VARIANT_CLASSES: Record<BadgeVariant, string> = BADGE_VARIANT_CLASSES;
