import type { StandardSize } from '@src-types/ui/base';
import type { FormGroupAlignment } from '@src-types/ui/forms';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * FormGroup gap classes
 */
const FORM_GROUP_GAP_CLASSES: Record<StandardSize | 'none', string> = {
	none: '',
	sm: 'gap-2',
	md: 'gap-4',
	lg: 'gap-6',
} as const;

/**
 * FormGroup alignment classes
 */
const FORM_GROUP_ALIGN_CLASSES: Record<FormGroupAlignment, string> = {
	start: 'items-start',
	center: 'items-center',
	end: 'items-end',
	stretch: 'items-stretch',
} as const;

/**
 * FormGroup variant definition using class-variance-authority
 *
 * Provides type-safe variant management for FormGroup component.
 */
export const formGroupVariants = cva('flex flex-col', {
	variants: {
		gap: {
			none: FORM_GROUP_GAP_CLASSES.none,
			sm: FORM_GROUP_GAP_CLASSES.sm,
			md: FORM_GROUP_GAP_CLASSES.md,
			lg: FORM_GROUP_GAP_CLASSES.lg,
		},
		align: {
			start: FORM_GROUP_ALIGN_CLASSES.start,
			center: FORM_GROUP_ALIGN_CLASSES.center,
			end: FORM_GROUP_ALIGN_CLASSES.end,
			stretch: FORM_GROUP_ALIGN_CLASSES.stretch,
		},
		fullWidth: {
			true: 'w-full',
			false: '',
		},
	},
	defaultVariants: {
		gap: 'md',
		align: 'start',
		fullWidth: false,
	},
});

/**
 * Type for form group variant props
 * Extracted from formGroupVariants using VariantProps
 */
export type FormGroupVariants = VariantProps<typeof formGroupVariants>;

/**
 * Helper function to get form group class names with proper merging
 *
 * @param props - FormGroup variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getFormGroupVariantClasses(
	props: FormGroupVariants & { className?: string | undefined }
): string {
	return twMerge(formGroupVariants(props), props.className);
}
