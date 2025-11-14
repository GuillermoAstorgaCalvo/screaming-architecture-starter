/**
 * List display constants
 * Uses design tokens for colors and spacing
 */
import type { StandardSize } from '@src-types/ui/base';
import type { ListVariant } from '@src-types/ui/layout/list';

export const LIST_BASE_CLASSES = 'list-none p-0 m-0';

export const LIST_VARIANT_CLASSES: Record<ListVariant, string> = {
	default: '',
	bordered: 'border border-border rounded-lg dark:border-border-dark',
	divided: 'divide-y divide-border dark:divide-border-dark',
} as const;

export const LIST_ITEM_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-sm py-sm',
	md: 'px-md py-md',
	lg: 'px-lg py-lg',
} as const;
