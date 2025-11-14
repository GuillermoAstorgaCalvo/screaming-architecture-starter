import type { StandardSize } from '@src-types/ui/base';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Fieldset variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Fieldset component.
 */
export const fieldsetVariants = cva(
	'border border-border dark:border-border rounded-md p-4 disabled:opacity-disabled disabled:cursor-not-allowed',
	{
		variants: {
			size: {
				sm: '',
				md: '',
				lg: '',
			} satisfies Record<StandardSize, string>,
		},
		defaultVariants: {
			size: 'md',
		},
	}
);

/**
 * Type for fieldset variant props
 * Extracted from fieldsetVariants using VariantProps
 */
export type FieldsetVariants = VariantProps<typeof fieldsetVariants>;

/**
 * Helper function to get fieldset class names with proper merging
 *
 * @param props - Fieldset variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getFieldsetVariantClasses(
	props: FieldsetVariants & { className?: string | undefined }
): string {
	return twMerge(fieldsetVariants(props), props.className);
}
