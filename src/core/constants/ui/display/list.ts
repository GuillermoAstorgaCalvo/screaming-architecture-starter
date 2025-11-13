/**
 * List display constants
 */
import type { StandardSize } from '@src-types/ui/base';
import type { ListVariant } from '@src-types/ui/layout/list';

export const LIST_BASE_CLASSES = 'list-none p-0 m-0';

export const LIST_VARIANT_CLASSES: Record<ListVariant, string> = {
	default: '',
	bordered: 'border border-gray-200 rounded-lg dark:border-gray-700',
	divided: 'divide-y divide-gray-200 dark:divide-gray-700',
} as const;

export const LIST_ITEM_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-3 py-2',
	md: 'px-4 py-3',
	lg: 'px-5 py-4',
} as const;
