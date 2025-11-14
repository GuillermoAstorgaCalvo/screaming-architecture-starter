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
	'inline-block rounded bg-muted px-1.5 py-0.5 font-mono font-medium text-text-primary dark:bg-muted-dark dark:text-text-primary-dark';

export const CODE_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-xs',
	md: 'text-sm',
	lg: 'text-base',
} as const;

export const CODE_BLOCK_BASE_CLASSES =
	'overflow-x-auto rounded-lg border bg-muted dark:bg-muted-dark dark:border-border-dark';

export const CODE_BLOCK_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'p-sm text-xs',
	md: 'p-md text-sm',
	lg: 'p-lg text-base',
} as const;

export const DESCRIPTION_LIST_BASE_CLASSES = '';

export const DESCRIPTION_LIST_ORIENTATION_CLASSES: Record<DescriptionListOrientation, string> = {
	horizontal: 'grid grid-cols-1 sm:grid-cols-[max-content_1fr] gap-x-md gap-y-sm',
	vertical: 'flex flex-col gap-y-sm',
} as const;

export const DESCRIPTION_LIST_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-sm gap-y-xs gap-x-sm',
	md: 'text-base gap-y-sm gap-x-md',
	lg: 'text-lg gap-y-sm gap-x-lg',
} as const;

export const DESCRIPTION_TERM_BASE_CLASSES =
	'font-medium text-text-primary dark:text-text-primary-dark';

export const DESCRIPTION_TERM_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
} as const;

export const DESCRIPTION_DETAILS_BASE_CLASSES = 'text-text-secondary dark:text-text-secondary-dark';

export const DESCRIPTION_DETAILS_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
} as const;
