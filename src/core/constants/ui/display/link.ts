/**
 * Link display constants
 */
import type { StandardSize } from '@src-types/ui/base';
import type { LinkVariant } from '@src-types/ui/navigation/link';

export const LINK_BASE_CLASSES =
	'inline-flex items-center text-primary underline-offset-4 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded';

export const LINK_VARIANT_CLASSES: Record<LinkVariant, string> = {
	default: 'text-primary hover:text-primary/90 dark:text-primary dark:hover:text-primary/80',
	subtle:
		'text-text-secondary hover:text-text-primary dark:text-text-secondary-dark dark:hover:text-text-primary-dark',
	muted:
		'text-text-muted hover:text-text-secondary dark:text-text-muted-dark dark:hover:text-text-secondary-dark',
} as const;

export const LINK_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
} as const;
