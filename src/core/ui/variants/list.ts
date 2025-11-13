import {
	LIST_BASE_CLASSES,
	LIST_ITEM_SIZE_CLASSES,
	LIST_VARIANT_CLASSES,
} from '@core/constants/ui/display/list';
import type { StandardSize } from '@src-types/ui/base';
import type { ListVariant } from '@src-types/ui/layout/list';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * List variant definition using class-variance-authority
 *
 * Provides type-safe variant management for List component.
 */
export const listVariants = cva(LIST_BASE_CLASSES, {
	variants: {
		variant: {
			default: LIST_VARIANT_CLASSES.default,
			bordered: LIST_VARIANT_CLASSES.bordered,
			divided: LIST_VARIANT_CLASSES.divided,
		} satisfies Record<ListVariant, string>,
	},
	defaultVariants: {
		variant: 'default',
	},
});

/**
 * Type for list variant props
 * Extracted from listVariants using VariantProps
 */
export type ListVariants = VariantProps<typeof listVariants>;

/**
 * Helper function to get list class names with proper merging
 *
 * @param props - List variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getListVariantClasses(
	props: ListVariants & { className?: string | undefined }
): string {
	return twMerge(listVariants(props), props.className);
}

/**
 * Helper function to get list item size classes
 *
 * @param size - List item size
 * @returns Size classes string
 */
export function getListItemSizeClasses(size: StandardSize): string {
	return LIST_ITEM_SIZE_CLASSES[size];
}
