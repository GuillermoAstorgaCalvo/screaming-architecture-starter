/**
 * Typography display constants
 */
import type { StandardSize } from '@src-types/ui/base';
import type { DescriptionListOrientation } from '@src-types/ui/data/description-list';

export const HEADING_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-lg font-semibold',
	md: 'text-xl font-semibold',
	lg: 'text-2xl font-bold',
} as const;

export const TEXT_TYPOGRAPHY_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-sm leading-relaxed',
	md: 'text-base leading-relaxed',
	lg: 'text-lg leading-relaxed',
} as const;

export const CODE_BASE_CLASSES =
	'inline-block rounded bg-gray-100 px-1.5 py-0.5 font-mono font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100';

export const CODE_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-xs',
	md: 'text-sm',
	lg: 'text-base',
} as const;

export const CODE_BLOCK_BASE_CLASSES =
	'overflow-x-auto rounded-lg border bg-gray-50 dark:bg-gray-900 dark:border-gray-700';

export const CODE_BLOCK_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'p-3 text-xs',
	md: 'p-4 text-sm',
	lg: 'p-5 text-base',
} as const;

export const DESCRIPTION_LIST_BASE_CLASSES = '';

export const DESCRIPTION_LIST_ORIENTATION_CLASSES: Record<DescriptionListOrientation, string> = {
	horizontal: 'grid grid-cols-1 sm:grid-cols-[max-content_1fr] gap-x-4 gap-y-2',
	vertical: 'flex flex-col gap-y-2',
} as const;

export const DESCRIPTION_LIST_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-sm gap-y-1.5 gap-x-3',
	md: 'text-base gap-y-2 gap-x-4',
	lg: 'text-lg gap-y-2.5 gap-x-5',
} as const;

export const DESCRIPTION_TERM_BASE_CLASSES = 'font-medium text-gray-900 dark:text-gray-100';

export const DESCRIPTION_TERM_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
} as const;

export const DESCRIPTION_DETAILS_BASE_CLASSES = 'text-gray-600 dark:text-gray-400';

export const DESCRIPTION_DETAILS_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
} as const;
