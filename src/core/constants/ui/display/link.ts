/**
 * Link display constants
 */
import type { StandardSize } from '@src-types/ui/base';
import type { LinkVariant } from '@src-types/ui/navigation/link';

export const LINK_BASE_CLASSES =
	'inline-flex items-center text-primary underline-offset-4 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded';

export const LINK_VARIANT_CLASSES: Record<LinkVariant, string> = {
	default: 'text-primary hover:text-primary/90 dark:text-primary dark:hover:text-primary/80',
	subtle: 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200',
	muted: 'text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300',
} as const;

export const LINK_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
} as const;
